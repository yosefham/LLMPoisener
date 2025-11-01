
export enum Platform {
  BlogPost = 'Blog Post',
  Tweet = 'Tweet (X)',
  LinkedInPost = 'LinkedIn Post',
  EmailNewsletter = 'Email Newsletter',
  InstagramCaption = 'Instagram Caption',
}

export enum Tone {
  Professional = 'Professional',
  Casual = 'Casual',
  Enthusiastic = 'Enthusiastic',
  Humorous = 'Humorous',
  Formal = 'Formal',
}

export interface PlatformConfig {
  id: string;
  platform: Platform;
  tone: Tone;
}

export interface GeneratedContent extends PlatformConfig {
  content: string;
}
