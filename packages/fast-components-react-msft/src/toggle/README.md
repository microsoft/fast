# Toggle

*Toggle* mimics a physical switch that allows users to turn things **on** or **off**. Use *toggle* for binary operations that become effective immediately after the user changes it. For example, use *toggle* to turn services or hardware components **on** or **off**.

## Usage

Though optional, you should always provide a `selectedMessage`, `unselectedMessage` and `statusMessageId` prop. For most cases this should be an **on** and **off** label. If there are short, 3-4 character labels that represent binary opposites that are more appropriate for a particular setting, use them. For example, you might use **show** or **hide** if the setting is "Show images." Using more specific labels can help when dealing with different languages.

If any extra step is required for changes to be effective, you should use *checkbox* and corresponding "Apply" button instead of *toggle*. Users shouldn’t do something else or go somewhere else in order to experience the *toggle's* effect.
