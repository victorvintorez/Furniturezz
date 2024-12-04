import {unlink} from "node:fs/promises";
import {logger} from "@bogeychan/elysia-logger";
import {hash} from "bun";
import {eq} from "drizzle-orm";
import Elysia, {t} from "elysia";
import type {User} from "lucia";
import {mysql} from "../db/db";
import {furnitureTable, imagesTable} from "../db/schema";
import {FurnitureModel} from "../models/furnitureModel.ts";
import {AuthService} from "../services/auth.service";

export const FurnitureDetailsController = new Elysia({ prefix: "/furniture" })
	.use(AuthService)
	.use(logger())
	.get("/", async ({ error, log }) => {
		try {
			return await mysql.query.furnitureTable.findMany({
				with: {
					images: {
						columns: {
							furnitureId: false,
						},
					},
					user: {
						columns: {
							id: false,
							username: true,
							passwordHash: false,
							title: false,
							firstName: false,
							lastName: false,
							gender: false,
							address1: false,
							address2: false,
							address3: false,
							postcode: false,
							description: true,
							email: true,
							telephone: true,
							profileImageUrl: true,
						},
					},
				},
			});
		} catch (e) {
			log.error(e);
			return error(500, "Error Retrieving Furniture");
		}
	})
	.post(
		"/",
		async ({ body, error, user, log }) => {
			user = user as User;

			try {
				const videoUrl = `./www/upload/furnitureVideo/${body.make}-${body.model}-${hash(await body.video.arrayBuffer())}.${body.video.name.split(".").pop()}`;
				await Bun.write(videoUrl, await body.video.arrayBuffer());

				try {
					const furnitureId = await mysql
						.insert(furnitureTable)
						.values({
							userId: user.id,
							make: body.make,
							model: body.model,
							color: body.color,
							type: body.type,
							location: body.location,
							year: body.year,
							videoUrl: videoUrl.replace("./www", ""),
						})
						.$returningId();

					try {
						const images = await Promise.all(
							body.images.map(async (image) => {
								const imageUrl = `./www/upload/furnitureImages/${body.make}-${body.model}-${hash(await image.arrayBuffer())}.${image.name.split(".").pop()}`;
								await Bun.write(imageUrl, await image.arrayBuffer());

								return {
									furnitureId: furnitureId[0].id,
									imageUrl: imageUrl.replace("./www", ""),
								};
							}),
						);

						try {
							await mysql.insert(imagesTable).values(
								images.map((image) => ({
									furnitureId: image.furnitureId,
									imageUrl: image.imageUrl,
								})),
							).$returningId();

							// 200 OK
							return { id: furnitureId[0].id };
						} catch (e) {
							await unlink(videoUrl);
							images.map(async (image) => {
								await unlink(image.imageUrl);
							});
							log.error(e);
							return error(500, "Error Saving Images");
						}

					} catch (e) {
						await unlink(videoUrl);
						await mysql
							.delete(furnitureTable)
							.where(eq(furnitureTable.id, furnitureId[0].id));
						log.error(e);
						return error(500, "Error Saving Images");
					}
				} catch (e) {
					await unlink(videoUrl);
					log.error(e);
					return error(500, "Error Saving Furniture");
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
				...t.Omit(FurnitureModel.insert, ["id", "userId", "videoUrl"])
					.properties,
				video: t.File({ type: "video", maxSize: "100m" }),
				images: t.Files({ type: "image", maxSize: "10m", minItems: 1, maxItems: 5 }),
			}),
		},
	)
	.get("/:id", async ({ error, log, params: { id }}) => {
		Number.isNaN(Number.parseInt(id)) && error(400, "Invalid ID");

		try {
			return await mysql.query.furnitureTable.findFirst({
				where: eq(furnitureTable.id, Number.parseInt(id))
			})
		} catch (e) {
			log.error(e);
			return error(500, "Error Retrieving Furniture");
		}
	})
	.patch(
		"/:id",
		async ({ body, error, log, user, params: { id }}) => {
			user = user as User;

			Number.isNaN(Number.parseInt(id)) && error(400, "Invalid ID");

			try {
				const furniture = await mysql.query.furnitureTable.findFirst({
					where: eq(furnitureTable.id, Number.parseInt(id)),
					with: {
						images: true,
					}
				})

				if (!furniture) {
					return error(404, "Furniture Not Found");
				}

				if (furniture.userId !== user.id) {
					return error(403, "Unauthorized");
				}

				let videoUrl: string | undefined = undefined;
				
				if(body.video) {
					try {
						// Delete old video
						await unlink(`./www/${furniture.videoUrl}`);

						// Create new video
						videoUrl = `./www/upload/furnitureVideo/${body.make ?? furniture.make}-${body.model ?? furniture.model}-${hash(await body.video.arrayBuffer())}.${body.video.name.split(".").pop()}`;
						await Bun.write(videoUrl, await body.video.arrayBuffer());
					} catch (e) {
						log.error(e);
						return error(500, "Error Saving Video");
					}
				}

				if(body.images) {
					try {
						try {
							// Delete old images
							await Promise.all(furniture.images.map(async (image) => {
								return await unlink(`./www/${image.imageUrl}`);
							}))

							await mysql.delete(imagesTable).where(eq(imagesTable.furnitureId, furniture.id));
						} catch (e) {
							log.error(e);
							return error(500, "Error Deleting Images");
						}

						// Create new images
						const images = await Promise.all(
							body.images.map(async (image) => {
								const imageUrl = `./www/upload/furnitureImages/${body.make ?? furniture.make}-${body.model ?? furniture.model}-${hash(await image.arrayBuffer())}.${image.name.split(".").pop()}`;
								await Bun.write(imageUrl, await image.arrayBuffer());

								return {
									furnitureId: furniture.id,
									imageUrl: imageUrl.replace("./www", ""),
								};
							}),
						);

						try {
							// Insert new images into db
							await mysql.insert(imagesTable).values(
								images.map((image) => ({
									furnitureId: image.furnitureId,
									imageUrl: image.imageUrl,
								})),
							).$returningId();
						} catch (e) {
							images.map(async (image) => {
								await unlink(image.imageUrl);
							});
							log.error(e);
							return error(500, "Error Saving Images");
						}
					} catch (e) {
						log.error(e);
						return error(500, "Error Saving Images");
					}
				}

				const bodyData = Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== undefined));


				try {
					await mysql.update(furnitureTable)
						.set({
							...bodyData,
							videoUrl: body.video && videoUrl ? videoUrl.replace("./www", "") : furniture.videoUrl,
						})
						.where(eq(furnitureTable.id, furniture.id));
				} catch (e) {
					log.error(e);
					return error(500, "Error Saving Furniture");
				}
			} catch (e) {
				log.error(e);
				return error(500, "Error Retrieving Furniture");
			}
		},
		{
			requireAuth: true,
			body: t.Object({
				make: t.Optional(t.String()),
				model: t.Optional(t.String()),
				color: t.Optional(t.String()),
				type: t.Optional(t.String()),
				location: t.Optional(t.String()),
				year: t.Optional(t.String()),
				video: t.Optional(t.File({ type: "video", maxSize: "100m" })),
				images: t.Optional(t.Files({ type: "image", maxSize: "10m", maxCount: 5 })),
			}),
		},
	)
	.delete(
		"/:id",
		async ({ error, log, user, params: { id }}) => {
			user = user as User;

			Number.isNaN(Number.parseInt(id)) && error(400, "Invalid ID");

			try {
				const furniture = await mysql.query.furnitureTable.findFirst({
					where: eq(furnitureTable.id, Number.parseInt(id)),
					with: {
						images: true,
					}
				})

				if (!furniture) {
					return error(404, "Furniture Not Found");
				}

				if (furniture.userId !== user.id) {
					return error(403, "Unauthorized");
				}

				try {
					// delete video
					await unlink(`./www/${furniture.videoUrl}`);

					// delete images
					await Promise.all(furniture.images.map(async (image) => {
						return await unlink(`./www/${image.imageUrl}`);
					}))

					await mysql.delete(imagesTable).where(eq(imagesTable.furnitureId, furniture.id));

					// delete furniture
					await mysql.delete(furnitureTable).where(eq(furnitureTable.id, furniture.id));
				} catch (e) {
					log.error(e);
					return error(500, "Error Deleting Furniture");
				}
			} catch (e) {
				log.error(e);
				return error(500, "Error Retrieving Furniture");
			}
		},
		{
			requireAuth: true,
		},
	);
