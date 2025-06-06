# Category-Aware AI Moderator

The `CategoryAwareModerator` is a sophisticated AI moderation system for the Togethr platform that adapts its behavior, tone, and messaging based on the specific mental health category of each therapy session.

## 🎯 Key Features

### Context-Aware Responses
- **Category-Specific Prompts**: Each mental health topic (anxiety, depression, loneliness, etc.) has unique prompt templates
- **Adaptive Tone**: Automatically adjusts communication style based on the session category
- **Safety Keywords**: Monitors for distress signals specific to each category

### Real-Time Session Management
- **Silence Detection**: Responds appropriately after 5+ seconds of group silence
- **Participation Monitoring**: Tracks group engagement levels and adapts accordingly
- **Distress Response**: Immediate safety-focused responses when distress is detected

### Intelligent Timing
- **60-Second Check-ins**: Regular interval prompts to maintain session flow
- **Prevents Over-messaging**: Limits consecutive AI messages to avoid dominating conversation
- **Contextual Delays**: Varies response timing based on session phase and participation

## 🧩 Supported Categories

### Anxiety Support
- **Tone**: Calming, grounding, reassuring
- **Focus**: Breathing techniques, physical sensations, coping strategies
- **Example**: "Would anyone like to share what made their heart race today?"

### Depression Support  
- **Tone**: Gentle, validating, hopeful without toxic positivity
- **Focus**: Small steps, energy management, self-compassion
- **Example**: "Sometimes just getting through the day is enough. How was today for you?"

### Loneliness & Isolation
- **Tone**: Warm, inviting, connected
- **Focus**: Building connections, sharing experiences
- **Example**: "Even just sharing can remind us we're not invisible. Would anyone like to start?"

### Trauma & Healing
- **Tone**: Gentle, safe, empowering
- **Focus**: Safety, boundaries, personal agency
- **Example**: "What does feeling safe mean to you?"

*And 6 more categories with specialized approaches*

## 🔧 Implementation

### Basic Usage

```tsx
import CategoryAwareModerator from '@/components/moderator/category-aware-moderator';

<CategoryAwareModerator
  category={currentSession.topic}
  incomingMessages={messages}
  onModeratorMessage={handleModeratorMessage}
  userCount={participants.length}
  isActive={true}
/>
```

### Advanced Configuration

```tsx
<CategoryAwareModerator
  category="anxiety"
  incomingMessages={messages}
  onModeratorMessage={handleModeratorMessage}
  userCount={4}
  silenceDurationMs={3000}           // Custom silence threshold
  isActive={true}                    // Enable/disable moderation
  sessionDurationMs={sessionTime}    // For context-aware responses
/>
```

## 🧠 Intelligent Behavior

### Response Contexts

1. **Silence Breakers**: When the group goes quiet
2. **Distress Response**: When safety keywords are detected
3. **Encouragement**: Positive reinforcement for sharing
4. **Transition**: Moving conversation forward
5. **Regular Check-ins**: Scheduled wellness prompts

### Participation Analysis

The moderator analyzes group dynamics in real-time:

- **High Participation**: 70%+ of users actively chatting
- **Medium Participation**: 40-70% engagement  
- **Low Participation**: <40% engagement

Response strategy adapts based on participation level.

### Safety Features

- **Keyword Monitoring**: Watches for distress signals
- **Crisis Response**: Immediate safety-focused messaging
- **Professional Referral**: Encourages professional support when appropriate
- **Non-directive Approach**: Never provides medical advice

## 💬 Sample Interactions

### Anxiety Session
```
User: "I can't breathe, everything feels overwhelming"
AI: "I'm noticing some distress in what you shared. You're not alone, and it's important that you stay safe. Let's take a moment to breathe together."
```

### Depression Session  
```
[5 seconds of silence]
AI: "Depression can make it hard to find words. That's okay. You don't have to have the right words. Just being here matters."
```

### Self-Esteem Session
```
User: "I feel like such a failure"
AI: "Your worth isn't determined by your productivity. You are worthy exactly as you are. What would you tell your younger self?"
```

## 🚫 Safety Guidelines

### What the AI Never Does
- Provide medical diagnosis or clinical advice
- Push users to respond or participate
- Use "should," "must," or directive language
- Minimize or dismiss experiences
- Rush healing or recovery processes

### What the AI Always Does
- Maintains empathetic, non-judgmental tone
- Respects silence and non-participation
- Prioritizes safety and crisis intervention
- Encourages professional support when needed
- Validates user experiences

## ⚙️ Technical Architecture

### Modular Design
- **Prompt Templates**: Separated in `/lib/moderator/prompts.ts`
- **Context Analysis**: Real-time sentiment and participation tracking
- **Timer Management**: Multiple concurrent timers for different response types
- **State Management**: Tracks conversation flow and moderator state

### Performance Optimized
- **Efficient Callbacks**: Uses `useCallback` for performance
- **Cleanup Handling**: Proper timer cleanup on unmount
- **Memory Management**: Optimized state updates

### Integration Ready
- **Zero UI**: Pure logic component, no rendering
- **Type Safe**: Full TypeScript support
- **Flexible**: Configurable timing and behavior
- **Observable**: Rich callback system for analytics

## 🎛️ Configuration Options

```typescript
interface CategoryAwareModeratorProps {
  category: MentalHealthTopic;           // Required: Session topic
  incomingMessages: ChatMessage[];       // Required: Live message feed
  onModeratorMessage: (text: string) => void; // Required: Response handler
  userCount: number;                     // Required: Participant count
  silenceDurationMs?: number;            // Optional: Custom silence threshold
  isActive?: boolean;                    // Optional: Enable/disable
  sessionDurationMs?: number;            // Optional: Session context
}
```

## 📊 Analytics & Insights

The moderator provides rich data for session analysis:

- **Response frequency** and timing patterns
- **Distress detection** and intervention rates  
- **Participation level** changes over time
- **Category-specific** engagement metrics

This data can be used to improve future sessions and understand user needs better.

---

*The CategoryAwareModerator represents a thoughtful approach to AI-assisted mental health support, balancing automation with human-centered design principles.* 