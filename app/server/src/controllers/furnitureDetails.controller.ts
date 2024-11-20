import Elysia, { t } from "elysia";
import { AuthService } from "../services/auth.service";
import { logger } from "@bogeychan/elysia-logger";
import { FurnitureDetailsModel } from "../models/furnitureDetails.model";
import { mysql } from "../db/db";
import {
	documentsTable,
	furnitureDetailsTable,
	furnitureImagesTable,
} from "../db/schema";
import { hash } from "bun";
import type { User } from "lucia";
import { eq } from "drizzle-orm";
import { unlink } from "node:fs/promises";

export const FurnitureDetailsController = new Elysia({ prefix: "/furniture" })
	.use(AuthService)
	.use(logger())
	.get("/", () => {
		return "All Furniture";
	})
	.get("/:id", (req) => {
		return `Furniture with id: ${req.params.id}`;
	})
	.post(
		"/",
		async ({ body, error, user, log }) => {
			user = user as User;

			try {
				const videoUrl = `./www/upload/furnitureVideo/${body.furnitureMake}-${body.furnitureModel}-${hash(await body.video.arrayBuffer())}.${body.video.name.split(".").pop()}`;
				await Bun.write(videoUrl, await body.video.arrayBuffer());

				const videoId = await mysql
					.insert(documentsTable)
					.values({
						documentType: "furnitureVideo",
						documentUrl: videoUrl.replace("./www", ""),
					})
					.$returningId();

				try {
					const values = await Promise.all(
						body.images.map(async (image) => {
							const imageUrl = `./www/upload/furnitureImages/${body.furnitureMake}-${body.furnitureModel}-${hash(await image.arrayBuffer())}.${image.name.split(".").pop()}`;
							await Bun.write(imageUrl, await image.arrayBuffer());

							return {
								documentType: "furnitureImage",
								documentUrl: imageUrl.replace("./www", ""),
							};
						}),
					);

					const imageIds = await mysql
						.insert(documentsTable)
						.values(values)
						.$returningId();

					try {
						const furnitureDetails = await mysql
							.insert(furnitureDetailsTable)
							.values({
								userId: user.id,
								furnitureMake: body.furnitureMake,
								furnitureModel: body.furnitureModel,
								furnitureColor: body.furnitureColor,
								furnitureType: body.furnitureType,
								location: body.location,
								year: body.year,
								videoId: videoId[0].id,
							})
							.$returningId();

						try {
							await mysql.insert(furnitureImagesTable).values(
								imageIds.map((image) => ({
									furnitureId: furnitureDetails[0].id,
									imageId: image.id,
								})),
							);

							return { id: furnitureDetails[0].id };
						} catch (e) {
							await mysql
								.delete(documentsTable)
								.where(eq(documentsTable.id, videoId[0].id));
							await unlink(videoUrl);
							await Promise.all(
								imageIds.map(async (image) => {
									const imgUrl = await mysql
										.select({ url: documentsTable.documentUrl })
										.from(documentsTable)
										.where(eq(documentsTable.id, image.id));
									await unlink(imgUrl[0].url);
									await mysql
										.delete(documentsTable)
										.where(eq(documentsTable.id, image.id));
								}),
							);
							await mysql
								.delete(furnitureDetailsTable)
								.where(eq(furnitureDetailsTable.id, furnitureDetails[0].id));
							log.error(e);
							return error(500, "Error Linking Furniture Images");
						}
					} catch (e) {
						await mysql
							.delete(documentsTable)
							.where(eq(documentsTable.id, videoId[0].id));
						await unlink(videoUrl);
						await Promise.all(
							imageIds.map(async (image) => {
								const imgUrl = await mysql
									.select({ url: documentsTable.documentUrl })
									.from(documentsTable)
									.where(eq(documentsTable.id, image.id));
								await unlink(imgUrl[0].url);
								await mysql
									.delete(documentsTable)
									.where(eq(documentsTable.id, image.id));
							}),
						);
						log.error(e);
						return error(500, "Error Saving Furniture");
					}
				} catch (e) {
					await mysql
						.delete(documentsTable)
						.where(eq(documentsTable.id, videoId[0].id));
					await unlink(videoUrl);
					log.error(e);
					return error(500, "Error Saving Images");
				}
			} catch (e) {
				log.error(e);
				return error(500, "Error Saving Video");
			}
		},
		{
			requireAuth: true,
			type: "formdata",
			body: t.Object({
				...t.Omit(FurnitureDetailsModel.insert, ["id", "userId", "videoId"]).properties,
					video: t.File({type: "video", maxSize: "100m"}),
					images: t.Files({type: "image", maxSize: "10m", maxCount: 5}),
			}),
		},
	)
	.patch(
		"/:id",
		(req) => {
			return `Furniture with id: ${req.params.id} updated`;
		},
		{
			requireAuth: true,
		},
	)
	.delete(
		"/:id",
		(req) => {
			return `Furniture with id: ${req.params.id} deleted`;
		},
		{
			requireAuth: true,
		},
	);
