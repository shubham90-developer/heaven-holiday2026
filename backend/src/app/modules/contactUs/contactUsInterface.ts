export interface IContactDetails {
  offices: {
    title?: string;
    description?: string;
    mapLink?: string;
  };

  callUs: {
    title?: string;
    phoneNumbers: string[];
  };

  writeToUs: {
    title?: string;
    emails: string[];
  };

  socialLinks: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    instagram?: string;
  };
}
