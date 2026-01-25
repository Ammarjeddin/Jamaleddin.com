# Workflow Preferences

## Subagent Delegation Pattern

**Always use subagents for multi-task work** to avoid running out of context quickly.

### How to work:
1. When given multiple tasks or a complex task, break it into discrete units
2. Assign each unit to a subagent using the Task tool with `subagent_type: "general-purpose"`
3. Run subagents in parallel when tasks are independent
4. If a subagent has questions or needs clarification, relay those questions to the user
5. After getting answers, resume the subagent with the clarification

### Subagent instructions should include:
- Clear file paths to work on
- Specific requirements and expected outcomes
- Context about the correct approach (e.g., dark mode styling rules)
- Tell subagents to use Serena plugin for code operations when appropriate

### Communication flow:
- User → Main agent → Subagents
- Subagent questions → Main agent → User → Main agent → Resume subagent with answer

### Benefits:
- Preserves main conversation context
- Allows parallel execution of independent tasks
- Keeps the main thread focused on coordination
- Reduces context exhaustion

## Dark Mode Approach (Site Template)

For this project, dark mode means:
- **Background becomes dark** (`dark:bg-slate-900`)
- **Cards/panels stay WHITE** (no `dark:bg-*` on cards)
- **Text stays dark** on white cards
- **Section headings** on dark background get `dark:text-white`
- **Add subtle shadow** to cards for dark mode: `dark:shadow-slate-700/20`
