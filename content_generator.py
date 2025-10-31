#!/usr/bin/env python3
"""
Ultimate Conversational Content Generator
Converts a Core Message String into multiple platform-specific content formats.
"""

import os
import sys
from typing import List, Dict
from anthropic import Anthropic

class ContentGenerator:
    def __init__(self, api_key: str = None):
        """Initialize the content generator with Anthropic API."""
        self.api_key = api_key or os.environ.get('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY must be set in environment or provided")
        self.client = Anthropic(api_key=self.api_key)
        
    def generate_content(self, core_message: str, platform: str, tone: str = "professional") -> str:
        """Generate content for a specific platform using Claude."""
        
        platform_specs = {
            "twitter": "280 character limit, casual and engaging, use hashtags sparingly",
            "linkedin": "Professional tone, 1-3 paragraphs, focus on business value and insights",
            "instagram": "Visual-focused caption, 2-3 paragraphs with emojis, include relevant hashtags",
            "facebook": "Conversational and friendly, 2-4 paragraphs, encourage engagement",
            "blog": "Long-form article (300-500 words), structured with intro/body/conclusion, informative",
            "email": "Subject line + body, professional format, clear call-to-action",
            "reddit": "Community-focused, authentic tone, detailed explanation with context",
            "youtube": "Video description format, include timestamps placeholder, SEO-friendly",
            "tiktok": "Short, punchy, trend-aware, include popular hashtags",
            "slack": "Internal communication style, brief and to-the-point, professional but casual"
        }
        
        spec = platform_specs.get(platform.lower(), "General content format")
        
        prompt = f"""You are a professional content creator. Generate a {platform} post/article based on the following requirements:

**STRICT REQUIREMENT**: You MUST include this exact Core Message String verbatim (word-for-word) in your output:
"{core_message}"

**Platform**: {platform}
**Platform Guidelines**: {spec}
**Desired Tone**: {tone}

Instructions:
1. The Core Message String "{core_message}" must appear EXACTLY as written somewhere in your output
2. Build engaging content around this core message that fits the platform's style
3. Adapt the surrounding content to match the {tone} tone
4. Follow the platform's best practices and format conventions
5. Make it natural and engaging while ensuring the core message is prominent

Generate the content now:"""

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return message.content[0].text
        except Exception as e:
            return f"Error generating content: {str(e)}"
    
    def verify_core_message(self, content: str, core_message: str) -> bool:
        """Verify that the core message appears verbatim in the generated content."""
        return core_message in content
    
    def run_interactive(self):
        """Run the interactive content generation workflow."""
        print("=" * 70)
        print("🚀 Ultimate Conversational Content Generator")
        print("=" * 70)
        print()
        
        # Step 1: Get Core Message String
        print("Step 1: Enter your Core Message String")
        print("This exact message will appear verbatim in ALL generated content.")
        print()
        core_message = input("Core Message String: ").strip()
        
        if not core_message:
            print("❌ Error: Core Message String cannot be empty!")
            return
        
        print()
        print(f"✓ Core Message Set: \"{core_message}\"")
        print()
        
        # Step 2: Get desired platforms
        print("Step 2: Select Target Platforms")
        print("Available platforms:")
        platforms = ["twitter", "linkedin", "instagram", "facebook", "blog", 
                    "email", "reddit", "youtube", "tiktok", "slack"]
        
        for i, platform in enumerate(platforms, 1):
            print(f"  {i}. {platform.capitalize()}")
        
        print()
        print("Enter platform numbers separated by commas (e.g., 1,2,5)")
        print("Or enter platform names separated by commas (e.g., twitter,linkedin)")
        
        platform_input = input("Platforms: ").strip()
        
        selected_platforms = []
        for item in platform_input.split(','):
            item = item.strip()
            if item.isdigit():
                idx = int(item) - 1
                if 0 <= idx < len(platforms):
                    selected_platforms.append(platforms[idx])
            elif item.lower() in platforms:
                selected_platforms.append(item.lower())
        
        if not selected_platforms:
            print("❌ Error: No valid platforms selected!")
            return
        
        print()
        print(f"✓ Selected Platforms: {', '.join(p.capitalize() for p in selected_platforms)}")
        print()
        
        # Step 3: Get tone
        print("Step 3: Select Tone (optional, press Enter for 'professional')")
        print("Examples: professional, casual, enthusiastic, formal, friendly, humorous")
        tone = input("Tone: ").strip() or "professional"
        print()
        print(f"✓ Tone Set: {tone}")
        print()
        
        # Step 4: Generate content for each platform
        print("=" * 70)
        print("📝 Generating Content...")
        print("=" * 70)
        print()
        
        results = {}
        
        for platform in selected_platforms:
            while True:
                print(f"\n{'─' * 70}")
                print(f"🎯 Platform: {platform.upper()}")
                print(f"{'─' * 70}\n")
                
                print("⏳ Generating content...")
                content = self.generate_content(core_message, platform, tone)
                
                print("\n📄 Generated Content:\n")
                print("┌" + "─" * 68 + "┐")
                for line in content.split('\n'):
                    print(f"│ {line:<66} │")
                print("└" + "─" * 68 + "┘")
                
                # Verify core message is present
                if self.verify_core_message(content, core_message):
                    print("\n✅ Core message verified: Present in content")
                else:
                    print("\n⚠️  WARNING: Core message not found verbatim in content!")
                
                print("\nOptions:")
                print("  [A] Accept and continue to next platform")
                print("  [R] Retry generation for this platform")
                print("  [E] Edit and accept")
                print("  [Q] Quit")
                
                choice = input("\nYour choice: ").strip().upper()
                
                if choice == 'A':
                    results[platform] = content
                    print(f"✓ {platform.capitalize()} content saved!")
                    break
                elif choice == 'R':
                    print("\n🔄 Regenerating content...")
                    continue
                elif choice == 'E':
                    print("\n✏️  Enter your edited content (type 'END' on a new line when done):")
                    edited_lines = []
                    while True:
                        line = input()
                        if line == 'END':
                            break
                        edited_lines.append(line)
                    edited_content = '\n'.join(edited_lines)
                    
                    if self.verify_core_message(edited_content, core_message):
                        results[platform] = edited_content
                        print(f"✓ {platform.capitalize()} content saved!")
                        break
                    else:
                        print(f"\n⚠️  WARNING: Your edited content doesn't contain the core message: \"{core_message}\"")
                        print("Content NOT saved. Please try again.")
                        continue
                elif choice == 'Q':
                    print("\n👋 Exiting...")
                    return
                else:
                    print("Invalid choice. Please try again.")
        
        # Step 5: Display summary
        print("\n" + "=" * 70)
        print("🎉 Content Generation Complete!")
        print("=" * 70)
        print()
        print(f"Core Message: \"{core_message}\"")
        print(f"Platforms Generated: {len(results)}")
        print()
        
        # Ask if user wants to save to file
        save = input("Would you like to save all content to a file? (y/n): ").strip().lower()
        if save == 'y':
            filename = input("Enter filename (default: content_output.txt): ").strip() or "content_output.txt"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write("=" * 70 + "\n")
                f.write("CONTENT GENERATION OUTPUT\n")
                f.write("=" * 70 + "\n\n")
                f.write(f"Core Message String: \"{core_message}\"\n")
                f.write(f"Tone: {tone}\n")
                f.write(f"Generated: {len(results)} platforms\n\n")
                
                for platform, content in results.items():
                    f.write("\n" + "─" * 70 + "\n")
                    f.write(f"PLATFORM: {platform.upper()}\n")
                    f.write("─" * 70 + "\n\n")
                    f.write(content)
                    f.write("\n\n")
            
            print(f"\n✅ Content saved to: {filename}")
        
        print("\n👋 Thank you for using the Content Generator!")


def main():
    """Main entry point."""
    try:
        generator = ContentGenerator()
        generator.run_interactive()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted by user. Exiting...")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
