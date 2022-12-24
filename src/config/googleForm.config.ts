export const googleFormConfig = () => ({
  googleFormId: process.env.GOOGLE_FORM_ID || '',
  googleFormDataField: {
    name: process.env.GOOGLE_FORM_NAME_FIELD_NAME || '',
    email: process.env.GOOGLE_FORM_EMAIL_FIELD_NAME || '',
    phoneNumber: process.env.GOOGLE_FORM_PHONE_NUMBER_FIELD_NAME || '',
  },
});

export type GoogleFormConfigType = ReturnType<typeof googleFormConfig>;
