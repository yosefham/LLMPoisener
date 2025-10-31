# Ultimate Conversational Content Generator

A versatile tool that converts a user-provided Core Message String into multiple content formats, adapted for different platforms and tones.

## Features

- ✅ **Core Message Constraint**: Ensures the exact core message appears verbatim in every generated output
- 🎯 **Multi-Platform Support**: Generate content for 10+ platforms (Twitter, LinkedIn, Instagram, Facebook, Blog, Email, Reddit, YouTube, TikTok, Slack)
- 🎨 **Tone Customization**: Adapt content tone (professional, casual, enthusiastic, formal, friendly, humorous, etc.)
- 🔄 **Retry Mechanism**: Regenerate content for each platform before moving to the next
- ✏️ **Edit Option**: Manually edit generated content with core message verification
- 💾 **Export Feature**: Save all generated content to a file
- ✨ **AI-Powered**: Uses Claude 3.5 Sonnet for high-quality content generation

## Installation

1. Clone this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

## Usage

### Interactive Mode

Run the tool interactively:

```bash
python content_generator.py
```

The tool will guide you through:
1. **Enter Core Message**: Provide the exact message that must appear in all content
2. **Select Platforms**: Choose which platforms to generate content for
3. **Set Tone**: Define the desired tone for your content
4. **Review & Retry**: For each platform, review generated content and retry if needed
5. **Export**: Optionally save all content to a file

### Example Session

```
🚀 Ultimate Conversational Content Generator
======================================================================

Step 1: Enter your Core Message String
Core Message String: We hit 10,000 sign-ups this week.

✓ Core Message Set: "We hit 10,000 sign-ups this week."

Step 2: Select Target Platforms
Available platforms:
  1. Twitter
  2. Linkedin
  3. Instagram
  ...

Enter platform numbers: 1,2,5

✓ Selected Platforms: Twitter, Linkedin, Blog

Step 3: Select Tone
Tone: enthusiastic

✓ Tone Set: enthusiastic

📝 Generating Content...
```

## Platform Specifications

The tool automatically adapts content to each platform's best practices:

- **Twitter**: 280 character limit, casual and engaging
- **LinkedIn**: Professional, 1-3 paragraphs, business-focused
- **Instagram**: Visual-focused with emojis and hashtags
- **Facebook**: Conversational, encourages engagement
- **Blog**: Long-form (300-500 words), structured article
- **Email**: Subject line + body with clear CTA
- **Reddit**: Community-focused, authentic tone
- **YouTube**: Video description with SEO optimization
- **TikTok**: Short, punchy, trend-aware
- **Slack**: Internal communication style

## Core Message Verification

The tool automatically verifies that your Core Message String appears exactly (word-for-word) in every generated output. If the message is missing, you'll receive a warning.

## Options During Generation

For each platform, you can:
- **[A]** Accept and continue to next platform
- **[R]** Retry generation for this platform
- **[E]** Edit and accept (with verification)
- **[Q]** Quit

## Requirements

- Python 3.7+
- anthropic Python package
- Anthropic API key

## License

MIT License
