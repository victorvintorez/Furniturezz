import { t } from "elysia";

export const formats = {
	IsUkTelephone: t.RegExp(/^(?:0|\+?44)(?:\d\s?){9,10}$/),
	IsUkPostcode: t.RegExp(/^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/),
	IsValidTitle: t.Union([
		t.Literal("Mr"),
		t.Literal("Mrs"),
		t.Literal("Miss"),
		t.Literal("Ms"),
		t.Literal("Dr"),
		t.Literal("Prof"),
		t.Literal("Rev"),
		t.Literal("Lord"),
		t.Literal("Lady"),
	]),
	IsValidGender: t.Union([
		t.Literal("Male"),
		t.Literal("Female"),
		t.Literal("Non-Binary"),
		t.Literal("Not Listed"),
		t.Literal("Other"),
	]),
	IsValidYear: t.RegExp(/^(19\d{2}|20\d{2})$/),
	IsValidDocType: t.Union([
		t.Literal("profileImage"),
		t.Literal("furnitureImage"),
		t.Literal("furnitureVideo"),
	]),
	IsValidPassword: t.RegExp(
		/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
	),
};
