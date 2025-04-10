import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import TimelineComponent from "./timelineComponent";

function App() {
	return (
		<div>
			<h2>Good luck with your assignment! {"\u2728"}</h2>
			<h3>{timelineItems.length} timeline items to render</h3>
			<TimelineComponent />
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import Timeline from "./assignLanes";

// function App() {
// 	return (
// 		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
// 			<header className="mb-6">
// 				<h1 className="text-3xl font-bold text-gray-800">
// 					Timeline Visualization
// 				</h1>
// 				<p className="text-gray-600 mt-2">
// 					Interactive timeline with zoom, pan, drag-and-drop editing, and lane
// 					organization
// 				</p>
// 			</header>

// 			<div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px]">
// 				<Timeline />
// 			</div>

// 			<footer className="mt-6 text-sm text-gray-500">
// 				<p>
// 					Timeline visualization component that efficiently organizes items in
// 					compact lanes. Click on the timeline to create new items, drag items
// 					to reposition, or use the handles to resize.
// 				</p>
// 			</footer>
// 		</div>
// 	);
// }

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);
