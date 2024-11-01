import { FormatRegistry } from "@sinclair/typebox";

const formats = {
	IsUkTelephone: (x: string) => /^(?:0|\+?44)(?:\d\s?){9,10}$/.test(x),
	IsUkPostcode: (x: string) =>
		/^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/.test(x),
	IsValidTitle: (x: string) =>
		["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof", "Rev", "Lord", "Lady"].includes(
			x,
		),
	IsValidGender: (x: string) =>
		["Male", "Female", "Non-Binary", "Not Listed", "Other"].includes(x),
	IsValidYear: (x: string) =>
		typeof Number.parseInt(x) === "number" &&
		Number.parseInt(x) >= 1900 &&
		Number.parseInt(x) <= new Date().getFullYear(),
	IsValidDocType: (x: string) =>
		["profileImage", "furnitureImage", "furnitureVideo"].includes(x),
	IsValidPassword: (x: string) =>
		/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(x),
};

FormatRegistry.Set("uk-telephone", formats.IsUkTelephone);
FormatRegistry.Set("uk-postcode", formats.IsUkPostcode);
FormatRegistry.Set("title", formats.IsValidTitle);
FormatRegistry.Set("gender", formats.IsValidGender);
FormatRegistry.Set("year", formats.IsValidYear);
FormatRegistry.Set("doc-type", formats.IsValidDocType);
FormatRegistry.Set("password", formats.IsValidPassword);
