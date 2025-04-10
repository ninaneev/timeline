- What you like about your implementation.< br / >
I really like how interactive and intuitive the timeline feels. The drag-and-drop functionality, with resizable events and inline editing, feels like Google Calendar or Airtable in a way. 
I also like the color-coded events to visually distinguish different tasks at a glance and make the timeline feel more dynamic. 
Implementing lane-specific positioning allowed me to prevent overlap and preserve each event’s integrity, which I think is key to a good calendar interface.

- What you would change if you were going to do it again.< br / >
If I were to start over, I would spend more time scoping the project upfront and breaking the timeline features into smaller, testable components. 
This would help avoid the domino effect when drag logic breaks resizing, or vice versa. I would also focus on implementing zoom in/out functionality, 
where the timeline can switch between hour, day, week, and month views with meaningful formatting. This would make it more usable across different levels of detail and make it a more production-ready tool.

- How you made your design decisions. For example, if you looked at other timelines for inspiration, please note that.< br / >
I looked at Google Calendar and Airtable’s timeline view because they both do a great job at being intuitive while still giving the user a lot of control. 
I also looked at Notion’s timeline and the react-calendar-timeline library for layout and drag behavior ideas, but implemented the core functionality from scratch for more control and learning. 
The core decision behind manual drag and resize logic was to really understand and control what’s happening behind the scenes, especially how state updates sync with positioning, and how to ensure immutability and predictability during interactions.

- How you would test this if you had more time.< br / >
 If I had more time, I’d do a full testing strategy, including: 
-Unit tests for utility functions like lane assignment and date parsing 
-Integration tests to simulate drag, drop, resize, and delete interactions 
-End-to-end tests with Cypress or Playwright to ensure the user can build, edit and navigate the timeline reliably 
-Accessibility tests to verify keyboard navigation, screen reader compatibility and color contrast 
I’d also mock out edge cases like overlapping items, items spanning months, or rapid user interaction to make sure the timeline holds up under pressure.
