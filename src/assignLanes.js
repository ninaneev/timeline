/**
 * Takes an array of items and assigns them to lanes based on start/end dates.
 * @returns an array of arrays containing items.
 */
export function assignLanes(items) {
	const sortedItems = items.sort(
		(a, b) => new Date(a.start) - new Date(b.start)
	);
	const lanes = [];

	function assignItemToLane(item) {
		for (const lane of lanes) {
			if (new Date(lane[lane.length - 1].end) < new Date(item.start)) {
				lane.push(item);
				return;
			}
		}
		lanes.push([item]);
	}

	for (const item of sortedItems) {
		assignItemToLane(item);
	}
	return lanes;
}

// import React, { useState, useEffect, useRef } from "react";
// import {
// 	ChevronLeft,
// 	ChevronRight,
// 	ZoomIn,
// 	ZoomOut,
// 	Pencil,
// 	Calendar,
// 	Plus,
// 	MoreHorizontal,
// 	Clock,
// 	Trash2,
// } from "lucide-react";

// // Sample timeline items - replace with your actual data
// const sampleTimelineItems = [
// 	{
// 		id: "item-1",
// 		name: "Project Kickoff",
// 		start: "2025-04-05",
// 		end: "2025-04-06",
// 		color: "#4285F4", // Google Calendar blue
// 		description: "Initial project meeting with stakeholders",
// 	},
// 	{
// 		id: "item-2",
// 		name: "Design Phase",
// 		start: "2025-04-07",
// 		end: "2025-04-12",
// 		color: "#0F9D58", // Google Calendar green
// 		description: "UI/UX design for new features",
// 	},
// 	{
// 		id: "item-3",
// 		name: "Development Sprint",
// 		start: "2025-04-09",
// 		end: "2025-04-15",
// 		color: "#DB4437", // Google Calendar red
// 		description: "Implement core functionality",
// 	},
// 	{
// 		id: "item-4",
// 		name: "Client Meeting",
// 		start: "2025-04-08",
// 		end: "2025-04-09",
// 		color: "#F4B400", // Google Calendar yellow
// 		description: "Progress review with client",
// 	},
// ];

// /**
//  * Takes an array of items and assigns them to lanes based on start/end dates.
//  * @returns an array of arrays containing items.
//  */
// function assignLanes(items) {
// 	const sortedItems = items.sort(
// 		(a, b) => new Date(a.start) - new Date(b.start)
// 	);
// 	const lanes = [];

// 	function assignItemToLane(item) {
// 		for (const lane of lanes) {
// 			// Allow items to share lanes if they do not overlap
// 			if (new Date(lane[lane.length - 1].end) < new Date(item.start)) {
// 				lane.push(item);
// 				return;
// 			}
// 		}
// 		lanes.push([item]);
// 	}

// 	for (const item of sortedItems) {
// 		assignItemToLane(item);
// 	}
// 	return lanes;
// }

// /**
//  * Calendar Timeline component to visualize items in a Google Calendar-like interface.
//  */
// export default function CalendarTimeline() {
// 	const [lanes, setLanes] = useState([]);
// 	const [zoomLevel, setZoomLevel] = useState(1);
// 	const [viewStartDate, setViewStartDate] = useState(null);
// 	const [viewEndDate, setViewEndDate] = useState(null);
// 	const [editingItem, setEditingItem] = useState(null);
// 	const [draggedItem, setDraggedItem] = useState(null);
// 	const [dragType, setDragType] = useState(null); // 'start', 'end', or 'move'
// 	const [items, setItems] = useState(sampleTimelineItems);
// 	const [selectedItem, setSelectedItem] = useState(null);
// 	const [viewMode, setViewMode] = useState("week"); // "day", "week", "month"
// 	const timelineRef = useRef(null);
// 	const today = new Date();

// 	// Initialize timeline with date range based on view mode
// 	useEffect(() => {
// 		setupDateRange();
// 	}, [viewMode, items]);

// 	const setupDateRange = () => {
// 		let start, end;
// 		const now = new Date();

// 		if (viewMode === "day") {
// 			start = new Date(now);
// 			end = new Date(now);
// 			end.setHours(23, 59, 59);
// 		} else if (viewMode === "week") {
// 			start = new Date(now);
// 			start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
// 			end = new Date(start);
// 			end.setDate(end.getDate() + 6); // End of week (Saturday)
// 		} else if (viewMode === "month") {
// 			start = new Date(now.getFullYear(), now.getMonth(), 1);
// 			end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// 		}

// 		// If we have items, adjust the range to include them
// 		if (items.length > 0) {
// 			const itemDates = items.flatMap((item) => [
// 				new Date(item.start),
// 				new Date(item.end),
// 			]);
// 			const minItemDate = new Date(Math.min(...itemDates));
// 			const maxItemDate = new Date(Math.max(...itemDates));

// 			// Expand range if needed to include all items
// 			if (minItemDate < start) start = minItemDate;
// 			if (maxItemDate > end) end = maxItemDate;
// 		}

// 		// Add some padding
// 		if (viewMode === "month") {
// 			// For month view, include previous and next month's days that appear in the calendar
// 			start.setDate(1);
// 			const startDayOfWeek = start.getDay();
// 			start.setDate(start.getDate() - startDayOfWeek);

// 			end.setDate(end.getDate() + (6 - end.getDay()));
// 		}

// 		setViewStartDate(start);
// 		setViewEndDate(end);

// 		// Assign items to lanes
// 		const assignedLanes = assignLanes([...items]);
// 		setLanes(assignedLanes);
// 	};

// 	// Date utility functions
// 	const formatDate = (date) => {
// 		if (!date) return "";
// 		return new Date(date).toLocaleDateString("en-US", {
// 			month: "short",
// 			day: "numeric",
// 			year: "numeric",
// 		});
// 	};

// 	const formatTimeLabel = (date) => {
// 		return new Date(date).toLocaleTimeString("en-US", {
// 			hour: "numeric",
// 			minute: "2-digit",
// 			hour12: true,
// 		});
// 	};

// 	const daysBetween = (date1, date2) => {
// 		const d1 = new Date(date1);
// 		const d2 = new Date(date2);
// 		return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
// 	};

// 	const addDays = (date, days) => {
// 		const result = new Date(date);
// 		result.setDate(result.getDate() + days);
// 		return result;
// 	};

// 	const toISODate = (date) => {
// 		return date.toISOString().split("T")[0];
// 	};

// 	// Timeline navigation functions
// 	const zoomIn = () => {
// 		setZoomLevel((prev) => Math.min(prev * 1.2, 5));
// 	};

// 	const zoomOut = () => {
// 		setZoomLevel((prev) => Math.max(prev / 1.2, 0.5));
// 	};

// 	const navigatePrevious = () => {
// 		if (viewMode === "day") {
// 			setViewStartDate(addDays(viewStartDate, -1));
// 			setViewEndDate(addDays(viewEndDate, -1));
// 		} else if (viewMode === "week") {
// 			setViewStartDate(addDays(viewStartDate, -7));
// 			setViewEndDate(addDays(viewEndDate, -7));
// 		} else if (viewMode === "month") {
// 			const newStart = new Date(viewStartDate);
// 			newStart.setMonth(newStart.getMonth() - 1);
// 			const newEnd = new Date(newStart);
// 			newEnd.setMonth(newEnd.getMonth() + 1);
// 			newEnd.setDate(0); // Last day of the month
// 			setViewStartDate(newStart);
// 			setViewEndDate(newEnd);
// 			setupDateRange();
// 		}
// 	};

// 	const navigateNext = () => {
// 		if (viewMode === "day") {
// 			setViewStartDate(addDays(viewStartDate, 1));
// 			setViewEndDate(addDays(viewEndDate, 1));
// 		} else if (viewMode === "week") {
// 			setViewStartDate(addDays(viewStartDate, 7));
// 			setViewEndDate(addDays(viewEndDate, 7));
// 		} else if (viewMode === "month") {
// 			const newStart = new Date(viewStartDate);
// 			newStart.setMonth(newStart.getMonth() + 1);
// 			const newEnd = new Date(newStart);
// 			newEnd.setMonth(newEnd.getMonth() + 1);
// 			newEnd.setDate(0); // Last day of the month
// 			setViewStartDate(newStart);
// 			setViewEndDate(newEnd);
// 			setupDateRange();
// 		}
// 	};

// 	const goToToday = () => {
// 		setupDateRange();
// 	};

// 	// Item editing functions
// 	const handleNameEdit = (e, id) => {
// 		const updatedItems = items.map((item) =>
// 			item.id === id ? { ...item, name: e.target.value } : item
// 		);
// 		setItems(updatedItems);
// 	};

// 	const handleDescriptionEdit = (e, id) => {
// 		const updatedItems = items.map((item) =>
// 			item.id === id ? { ...item, description: e.target.value } : item
// 		);
// 		setItems(updatedItems);
// 	};

// 	const deleteItem = (id) => {
// 		const updatedItems = items.filter((item) => item.id !== id);
// 		setItems(updatedItems);
// 		setSelectedItem(null);
// 	};

// 	// Drag handling functions
// 	const startDrag = (item, type, e) => {
// 		e.stopPropagation();
// 		setDraggedItem(item);
// 		setDragType(type);
// 	};

// 	const onDrag = (e) => {
// 		if (!draggedItem || !timelineRef.current) return;

// 		const rect = timelineRef.current.getBoundingClientRect();
// 		const totalDays = daysBetween(viewStartDate, viewEndDate);
// 		const daysPerPixel = totalDays / rect.width;

// 		const pixelsMoved = e.clientX - rect.left;
// 		const daysMoved = Math.floor(pixelsMoved * daysPerPixel);
// 		const newDate = toISODate(addDays(viewStartDate, daysMoved));

// 		const updatedItems = items.map((item) => {
// 			if (item.id === draggedItem.id) {
// 				if (dragType === "start") {
// 					// Ensure start date is not after end date
// 					if (new Date(newDate) < new Date(item.end)) {
// 						return { ...item, start: newDate };
// 					}
// 				} else if (dragType === "end") {
// 					// Ensure end date is not before start date
// 					if (new Date(newDate) > new Date(item.start)) {
// 						return { ...item, end: newDate };
// 					}
// 				} else if (dragType === "move") {
// 					const duration = daysBetween(item.start, item.end);
// 					const newStart = toISODate(addDays(viewStartDate, daysMoved));
// 					const newEnd = toISODate(
// 						addDays(viewStartDate, daysMoved + duration)
// 					);
// 					return { ...item, start: newStart, end: newEnd };
// 				}
// 			}
// 			return item;
// 		});

// 		setItems(updatedItems);
// 		setLanes(assignLanes([...updatedItems]));
// 	};

// 	const endDrag = () => {
// 		setDraggedItem(null);
// 		setDragType(null);
// 	};

// 	// Click on timeline to create new item
// 	const handleTimelineClick = (e) => {
// 		if (draggedItem) return;

// 		// Close item details if open
// 		setSelectedItem(null);

// 		const rect = timelineRef.current.getBoundingClientRect();
// 		const totalDays = daysBetween(viewStartDate, viewEndDate);
// 		const daysPerPixel = totalDays / rect.width;

// 		const pixelsMoved = e.clientX - rect.left;
// 		const daysMoved = Math.floor(pixelsMoved * daysPerPixel);
// 		const clickDate = toISODate(addDays(viewStartDate, daysMoved));

// 		// Create a new item that spans 1 day
// 		const newItem = {
// 			id: `item-${Date.now()}`,
// 			name: "New Event",
// 			start: clickDate,
// 			end: toISODate(addDays(new Date(clickDate), 1)),
// 			color: "#4285F4", // Google Calendar default blue
// 			description: "Event description",
// 		};

// 		const updatedItems = [...items, newItem];
// 		setItems(updatedItems);
// 		setLanes(assignLanes(updatedItems));
// 		setEditingItem(newItem.id); // Start editing the new item name
// 		setSelectedItem(newItem);
// 	};

// 	// Calculate timeline scales
// 	const totalDays =
// 		viewStartDate && viewEndDate
// 			? daysBetween(viewStartDate, viewEndDate) + 1
// 			: 0;
// 	const timelineWidth =
// 		viewMode === "month" ? "100%" : `${totalDays * 120 * zoomLevel}px`;

// 	// Generate day labels for the timeline header
// 	const dayLabels = [];
// 	if (viewStartDate && viewEndDate) {
// 		let currentDate = new Date(viewStartDate);
// 		while (currentDate <= viewEndDate) {
// 			const isToday =
// 				currentDate.getDate() === today.getDate() &&
// 				currentDate.getMonth() === today.getMonth() &&
// 				currentDate.getFullYear() === today.getFullYear();

// 			const dayLabel = {
// 				date: new Date(currentDate),
// 				dayName: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
// 				dayNumber: currentDate.getDate(),
// 				isToday,
// 				position: (daysBetween(viewStartDate, currentDate) / totalDays) * 100,
// 			};

// 			dayLabels.push(dayLabel);
// 			currentDate.setDate(currentDate.getDate() + 1);
// 		}
// 	}

// 	// Generate month name for header
// 	const monthYearDisplay = viewStartDate
// 		? new Date(viewStartDate).toLocaleDateString("en-US", {
// 				month: "long",
// 				year: "numeric",
// 		  })
// 		: "";

// 	// Custom title based on view mode
// 	let periodTitle = "";
// 	if (viewStartDate && viewEndDate) {
// 		if (viewMode === "day") {
// 			periodTitle = new Date(viewStartDate).toLocaleDateString("en-US", {
// 				weekday: "long",
// 				month: "long",
// 				day: "numeric",
// 				year: "numeric",
// 			});
// 		} else if (viewMode === "week") {
// 			periodTitle = `${formatDate(viewStartDate)} - ${formatDate(viewEndDate)}`;
// 		} else {
// 			periodTitle = new Date(viewStartDate).toLocaleDateString("en-US", {
// 				month: "long",
// 				year: "numeric",
// 			});
// 		}
// 	}

// 	// Render loading state if date range is not yet determined
// 	if (!viewStartDate || !viewEndDate) return <div>Loading calendar...</div>;

// 	return (
// 		<div className="flex flex-col w-full h-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
// 			{/* Calendar header with controls */}
// 			<div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
// 				<div className="flex items-center space-x-4">
// 					<h2 className="text-xl font-medium text-gray-800">Calendar</h2>
// 					<button
// 						onClick={goToToday}
// 						className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
// 					>
// 						Today
// 					</button>
// 					<div className="flex">
// 						<button
// 							onClick={navigatePrevious}
// 							className="p-1 rounded hover:bg-gray-100"
// 							title="Previous"
// 						>
// 							<ChevronLeft size={20} />
// 						</button>
// 						<button
// 							onClick={navigateNext}
// 							className="p-1 rounded hover:bg-gray-100"
// 							title="Next"
// 						>
// 							<ChevronRight size={20} />
// 						</button>
// 					</div>
// 					<h3 className="text-lg font-medium">{periodTitle}</h3>
// 				</div>

// 				<div className="flex gap-2">
// 					<div className="flex border border-gray-300 rounded overflow-hidden">
// 						<button
// 							onClick={() => setViewMode("day")}
// 							className={`px-3 py-1 text-sm ${
// 								viewMode === "day" ? "bg-blue-50 text-blue-600" : "bg-white"
// 							}`}
// 						>
// 							Day
// 						</button>
// 						<button
// 							onClick={() => setViewMode("week")}
// 							className={`px-3 py-1 text-sm ${
// 								viewMode === "week" ? "bg-blue-50 text-blue-600" : "bg-white"
// 							}`}
// 						>
// 							Week
// 						</button>
// 						<button
// 							onClick={() => setViewMode("month")}
// 							className={`px-3 py-1 text-sm ${
// 								viewMode === "month" ? "bg-blue-50 text-blue-600" : "bg-white"
// 							}`}
// 						>
// 							Month
// 						</button>
// 					</div>

// 					<button
// 						onClick={() => {
// 							// Create event at current date
// 							const newItem = {
// 								id: `item-${Date.now()}`,
// 								name: "New Event",
// 								start: toISODate(new Date()),
// 								end: toISODate(addDays(new Date(), 1)),
// 								color: "#4285F4",
// 								description: "Event description",
// 							};

// 							const updatedItems = [...items, newItem];
// 							setItems(updatedItems);
// 							setLanes(assignLanes(updatedItems));
// 							setSelectedItem(newItem);
// 							setEditingItem(newItem.id);

// 							// Make sure the new event is visible
// 							setupDateRange();
// 						}}
// 						className="p-2 bg-blue-600 text-white rounded shadow flex items-center hover:bg-blue-700 transition-colors"
// 						title="Create event"
// 					>
// 						<Plus size={16} className="mr-1" />
// 						<span>Create</span>
// 					</button>
// 				</div>
// 			</div>

// 			<div className="flex flex-1 overflow-hidden">
// 				{/* Sidebar for all-day events or mini calendar in a real implementation */}
// 				{viewMode !== "month" && (
// 					<div className="w-16 border-r border-gray-200 bg-gray-50 p-2 flex flex-col items-center pt-16">
// 						<div className="text-xs text-gray-500">All day</div>
// 					</div>
// 				)}

// 				<div className="relative overflow-x-auto flex-1">
// 					{/* Day/date labels header (sticky) */}
// 					<div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
// 						{/* Weekday names */}
// 						<div className="flex h-12">
// 							{viewMode !== "month" && (
// 								<div className="w-16 border-r border-gray-200"></div>
// 							)}

// 							<div className="flex-1 flex" style={{ minWidth: timelineWidth }}>
// 								{dayLabels.map((day, i) => {
// 									const dayWidth =
// 										viewMode === "month"
// 											? `${100 / 7}%`
// 											: `${100 / totalDays}%`;

// 									return (
// 										<div
// 											key={i}
// 											className={`flex flex-col items-center justify-center border-l border-gray-100 ${
// 												day.isToday ? "bg-blue-50" : ""
// 											}`}
// 											style={{ width: dayWidth }}
// 										>
// 											<div className="text-xs font-medium text-gray-500">
// 												{day.dayName}
// 											</div>
// 											<div
// 												className={`flex items-center justify-center w-8 h-8 mt-1 ${
// 													day.isToday
// 														? "bg-blue-600 text-white rounded-full"
// 														: "text-gray-800"
// 												}`}
// 											>
// 												{day.dayNumber}
// 											</div>
// 										</div>
// 									);
// 								})}
// 							</div>
// 						</div>
// 					</div>

// 					{/* Calendar body with lanes and items */}
// 					<div
// 						ref={timelineRef}
// 						className="relative"
// 						style={{
// 							width: timelineWidth,
// 							minHeight: viewMode === "month" ? "600px" : "500px",
// 						}}
// 						onMouseMove={draggedItem ? onDrag : null}
// 						onMouseUp={draggedItem ? endDrag : null}
// 						onMouseLeave={draggedItem ? endDrag : null}
// 						onClick={handleTimelineClick}
// 					>
// 						{/* Time indicators (for day/week view) */}
// 						{viewMode !== "month" && (
// 							<div className="absolute top-0 left-0 h-full w-16 border-r border-gray-200 bg-gray-50">
// 								{Array.from({ length: 24 }).map((_, hour) => (
// 									<div
// 										key={hour}
// 										className="h-12 border-b border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500"
// 										style={{ marginTop: hour === 0 ? "0" : "" }}
// 									>
// 										{hour === 0
// 											? "12 AM"
// 											: hour < 12
// 											? `${hour} AM`
// 											: hour === 12
// 											? "12 PM"
// 											: `${hour - 12} PM`}
// 									</div>
// 								))}
// 							</div>
// 						)}

// 						{/* Hour gridlines (for day/week view) */}
// 						{viewMode !== "month" && (
// 							<div className="absolute top-0 left-16 right-0 h-full pointer-events-none">
// 								{Array.from({ length: 24 }).map((_, hour) => (
// 									<div
// 										key={hour}
// 										className="h-12 border-b border-gray-200 w-full"
// 									/>
// 								))}
// 							</div>
// 						)}

// 						{/* Month grid (for month view) */}
// 						{viewMode === "month" && (
// 							<div className="grid grid-cols-7 h-full">
// 								{dayLabels.map((day, i) => (
// 									<div
// 										key={i}
// 										className={`border-r border-b border-gray-200 min-h-24 ${
// 											day.isToday ? "bg-blue-50" : ""
// 										}`}
// 									/>
// 								))}
// 							</div>
// 						)}

// 						{/* Events rendering */}
// 						{lanes.map((lane, laneIndex) => (
// 							<div
// 								key={laneIndex}
// 								className="relative"
// 								style={{
// 									left: viewMode !== "month" ? "16px" : "0",
// 									right: "0",
// 									height: viewMode === "month" ? "auto" : "100%",
// 									position: "absolute",
// 									width: viewMode !== "month" ? "calc(100% - 16px)" : "100%",
// 								}}
// 							>
// 								{lane.map((item) => {
// 									const startDate = new Date(item.start);
// 									const endDate = new Date(item.end);

// 									// Calculate position and width
// 									let startPosition, width;

// 									if (viewMode === "month") {
// 										// For month view, place based on day position in the grid
// 										const dayIndex = dayLabels.findIndex(
// 											(day) =>
// 												day.date.getDate() === startDate.getDate() &&
// 												day.date.getMonth() === startDate.getMonth()
// 										);

// 										if (dayIndex === -1) return null; // Skip if not in current view

// 										const columnWidth = 100 / 7; // 7 days per week
// 										startPosition = `${dayIndex * columnWidth}%`;

// 										// Duration in days, capped to end of week
// 										const durationDays = Math.min(
// 											daysBetween(startDate, endDate),
// 											7 - (dayIndex % 7) // Days remaining in week
// 										);
// 										width = `${columnWidth * durationDays}%`;
// 									} else {
// 										// For day/week view
// 										startPosition = `${
// 											(daysBetween(viewStartDate, startDate) / totalDays) * 100
// 										}%`;
// 										width = `${
// 											(daysBetween(startDate, endDate) / totalDays) * 100
// 										}%`;

// 										// Ensure minimum width for visibility
// 										width = `${Math.max(
// 											(daysBetween(startDate, endDate) / totalDays) * 100,
// 											2
// 										)}%`;
// 									}

// 									return (
// 										<div
// 											key={item.id}
// 											className={`absolute rounded overflow-hidden cursor-pointer select-none transition-shadow hover:shadow-md ${
// 												selectedItem?.id === item.id
// 													? "ring-2 ring-blue-500"
// 													: ""
// 											}`}
// 											style={{
// 												left: startPosition,
// 												width: width,
// 												backgroundColor: item.color || "#4285F4",
// 												opacity: draggedItem?.id === item.id ? 0.7 : 1,
// 												top:
// 													viewMode === "month"
// 														? `${(laneIndex % 5) * 20 + 5}px`
// 														: `${
// 																(startDate.getHours() * 60 +
// 																	startDate.getMinutes()) *
// 																0.8
// 														  }px`,
// 												height:
// 													viewMode === "month"
// 														? "18px"
// 														: `${
// 																(endDate.getHours() * 60 +
// 																	endDate.getMinutes() -
// 																	startDate.getHours() * 60 -
// 																	startDate.getMinutes()) *
// 																0.8
// 														  }px`,
// 												minHeight: "22px",
// 												zIndex: selectedItem?.id === item.id ? 100 : 10,
// 											}}
// 											onMouseDown={(e) => startDrag(item, "move", e)}
// 											onClick={(e) => {
// 												e.stopPropagation();
// 												setSelectedItem(item);
// 											}}
// 											title={`${item.name}: ${formatDate(
// 												item.start
// 											)} - ${formatDate(item.end)}`}
// 										>
// 											{/* Drag handle for start */}
// 											<div
// 												className="w-2 h-full cursor-col-resize bg-gray-700 opacity-10 hover:opacity-30 absolute left-0"
// 												onMouseDown={(e) => startDrag(item, "start", e)}
// 												title="Drag to change start date"
// 											/>

// 											{/* Item content */}
// 											<div className="flex-1 px-2 py-1 truncate text-white text-xs">
// 												{editingItem === item.id ? (
// 													<input
// 														type="text"
// 														value={item.name}
// 														onChange={(e) => handleNameEdit(e, item.id)}
// 														onBlur={() => setEditingItem(null)}
// 														onKeyDown={(e) =>
// 															e.key === "Enter" && setEditingItem(null)
// 														}
// 														autoFocus
// 														className="w-full bg-transparent text-white outline-none text-xs"
// 														onClick={(e) => e.stopPropagation()}
// 													/>
// 												) : (
// 													<span className="truncate font-medium">
// 														{item.name}
// 													</span>
// 												)}
// 											</div>

// 											{/* Drag handle for end */}
// 											<div
// 												className="w-2 h-full cursor-col-resize bg-gray-700 opacity-10 hover:opacity-30 absolute right-0"
// 												onMouseDown={(e) => startDrag(item, "end", e)}
// 												title="Drag to change end date"
// 											/>
// 										</div>
// 									);
// 								})}
// 							</div>
// 						))}
// 					</div>
// 				</div>

// 				{/* Event details side panel when an event is selected */}
// 				{selectedItem && (
// 					<div className="w-72 border-l border-gray-200 p-4 bg-white overflow-y-auto flex flex-col">
// 						<div className="flex justify-between items-center mb-4">
// 							<h3 className="font-medium">Event details</h3>
// 							<button
// 								onClick={() => setSelectedItem(null)}
// 								className="text-gray-500 hover:text-gray-700"
// 							>
// 								<ChevronRight size={20} />
// 							</button>
// 						</div>

// 						<div className="mb-4">
// 							{editingItem === selectedItem.id ? (
// 								<input
// 									type="text"
// 									value={selectedItem.name}
// 									onChange={(e) => handleNameEdit(e, selectedItem.id)}
// 									onBlur={() => setEditingItem(null)}
// 									onKeyDown={(e) => e.key === "Enter" && setEditingItem(null)}
// 									autoFocus
// 									className="w-full text-lg font-medium border-b border-gray-300 pb-1 focus:outline-none focus:border-blue-500"
// 								/>
// 							) : (
// 								<div className="flex justify-between items-center">
// 									<h2 className="text-lg font-medium">{selectedItem.name}</h2>
// 									<button
// 										onClick={() => setEditingItem(selectedItem.id)}
// 										className="text-gray-500 hover:text-gray-700"
// 										title="Edit event name"
// 									>
// 										<Pencil size={14} />
// 									</button>
// 								</div>
// 							)}
// 						</div>

// 						<div className="flex items-start mb-3">
// 							<Calendar size={18} className="text-gray-500 mr-3 mt-1" />
// 							<div>
// 								<div className="font-medium">
// 									{formatDate(selectedItem.start)}
// 								</div>
// 								<div className="text-gray-500 text-sm">
// 									{formatTimeLabel(selectedItem.start)} -{" "}
// 									{formatTimeLabel(selectedItem.end)}
// 								</div>
// 							</div>
// 						</div>

// 						<div className="flex items-start mb-4">
// 							<Clock size={18} className="text-gray-500 mr-3 mt-1" />
// 							<div className="text-gray-700">
// 								{daysBetween(selectedItem.start, selectedItem.end)} day
// 								{daysBetween(selectedItem.start, selectedItem.end) !== 1
// 									? "s"
// 									: ""}
// 							</div>
// 						</div>

// 						<div className="mb-4">
// 							<label className="block text-sm font-medium text-gray-700 mb-1">
// 								Description
// 							</label>
// 							<textarea
// 								value={selectedItem.description || ""}
// 								onChange={(e) => handleDescriptionEdit(e, selectedItem.id)}
// 								className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-24"
// 								placeholder="Add a description"
// 							></textarea>
// 						</div>

// 						<div className="mb-4">
// 							<label className="block text-sm font-medium text-gray-700 mb-1">
// 								Color
// 							</label>
// 							<div className="flex gap-2">
// 								{["#4285F4", "#0F9D58", "#DB4437", "#F4B400", "#8430CE"].map(
// 									(color) => (
// 										<button
// 											key={color}
// 											className={`w-6 h-6 rounded-full ${
// 												selectedItem.color === color
// 													? "ring-2 ring-gray-400"
// 													: ""
// 											}`}
// 											style={{ backgroundColor: color }}
// 											onClick={() => {
// 												const updatedItems = items.map((item) =>
// 													item.id === selectedItem.id
// 														? { ...item, color }
// 														: item
// 												);
// 												setItems(updatedItems);
// 												setSelectedItem({ ...selectedItem, color });
// 											}}
// 										/>
// 									)
// 								)}
// 							</div>
// 						</div>

// 						<div className="mt-auto pt-4 border-t border-gray-200">
// 							<button
// 								onClick={() => deleteItem(selectedItem.id)}
// 								className="flex items-center text-gray-700 hover:text-red-600"
// 							>
// 								<Trash2 size={16} className="mr-1" />
// 								<span>Delete event</span>
// 							</button>
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }
