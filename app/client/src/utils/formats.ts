export const formats = {
	IsUkTelephone: /^(?:0|\+?44)(?:\d\s?){9,10}$/,
	IsUkPostcode: /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/,
	IsValidPassword: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
};
