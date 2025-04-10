import React, { useState, useRef } from "react";
import moment from "moment";
import timelineItemsData from "./timelineItems";
import "./timeline.css";

const ZOOM_WIDTHS = { day: 40, week: 80, month: 120 };
const ZOOM_UNITS = { day: "day", week: "week", month: "month" };
const LANE_HEIGHT = 50;
const COLORS = [
	"#9C83F7",
	"#F783AC",
	"#FFCE56",
	"#4BC0C0",
	"#36A2EB",
	"#FF6384",
];
const TIMELINE_START = moment.min(
	timelineItemsData.map((i) => moment(i.start))
);
const TIMELINE_END = moment.max(timelineItemsData.map((i) => moment(i.end)));
const TOTAL_DAYS = TIMELINE_END.diff(TIMELINE_START, "days") + 1;

const Timeline = () => {
	const [timelineItems, setTimelineItems] = useState(
		timelineItemsData.map((item, index) => ({
			...item,
			color: COLORS[index % COLORS.length],
			laneIndex: 0,
		}))
	);
	const [editingItemId, setEditingItemId] = useState(null);
	const [editingText, setEditingText] = useState("");
	const [view, setView] = useState("day");
	const dragInfo = useRef(null);

	const getStartOfUnit = (date, unit) => {
		return moment(date).startOf(unit);
	};

	const getUnitDiff = (start, end, unit) => {
		return moment(end).diff(moment(start), unit);
	};

	const handleMouseDown = (e, item, type, laneIndex) => {
		e.preventDefault();
		dragInfo.current = {
			item,
			type,
			startX: e.clientX,
			startY: e.clientY,
			initialLaneIndex: laneIndex,
		};
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!dragInfo.current) return;
		const { item, type, startX, startY, initialLaneIndex } = dragInfo.current;
		const deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;
		const zoomWidth = ZOOM_WIDTHS[view];
		const unit = ZOOM_UNITS[view];
		const unitOffset = Math.round(deltaX / zoomWidth);
		const laneOffset = Math.round(deltaY / LANE_HEIGHT);

		setTimelineItems((prevItems) =>
			prevItems.map((i) => {
				if (i.id === item.id) {
					if (type === "move") {
						const newStart = moment(item.start).add(unitOffset, unit);
						const newEnd = moment(item.end).add(unitOffset, unit);
						return {
							...i,
							start: newStart.format("YYYY-MM-DD"),
							end: newEnd.format("YYYY-MM-DD"),
							laneIndex: Math.max(0, initialLaneIndex + laneOffset),
						};
					} else if (type === "resize-start") {
						const newStart = moment(item.start).add(unitOffset, unit);
						if (newStart.isBefore(moment(i.end))) {
							return { ...i, start: newStart.format("YYYY-MM-DD") };
						}
					} else if (type === "resize-end") {
						const newEnd = moment(item.end).add(unitOffset, unit);
						if (newEnd.isAfter(moment(i.start))) {
							return { ...i, end: newEnd.format("YYYY-MM-DD") };
						}
					}
				}
				return i;
			})
		);
	};

	const handleMouseUp = () => {
		dragInfo.current = null;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	const handleDeleteItem = (id) => {
		setTimelineItems((prev) => prev.filter((item) => item.id !== id));
	};

	const renderHeader = () => {
		const labels = [];
		const zoomWidth = ZOOM_WIDTHS[view];
		const unit = ZOOM_UNITS[view];
		let current = moment(TIMELINE_START);
		const totalUnits = getUnitDiff(TIMELINE_START, TIMELINE_END, unit) + 1;

		for (let i = 0; i < totalUnits; i++) {
			let label;
			if (view === "day") label = current.format("dd D MMM");
			else if (view === "week")
				label = `W${current.isoWeek()} ${current.format("YYYY")}`;
			else label = current.format("MMM YYYY");

			labels.push(
				<div
					key={i}
					className="timeline-day"
					style={{ width: zoomWidth, minWidth: zoomWidth }}
				>
					{label}
				</div>
			);
			current.add(1, unit);
		}
		return <div className="timeline-header">{labels}</div>;
	};

	const renderLanes = () => {
		const lanes = [];
		timelineItems.forEach((item) => {
			const index = item.laneIndex || 0;
			if (!lanes[index]) lanes[index] = [];
			lanes[index].push(item);
		});

		return lanes.map((lane, i) => (
			<div key={i} className="timeline-lane" style={{ height: LANE_HEIGHT }}>
				{lane.map((item) => {
					const zoomWidth = ZOOM_WIDTHS[view];
					const unit = ZOOM_UNITS[view];
					const start = moment(item.start);
					const end = moment(item.end);
					const offset = getUnitDiff(TIMELINE_START, start, unit) * zoomWidth;
					const width = (getUnitDiff(start, end, unit) + 1) * zoomWidth;

					return (
						<div
							key={item.id}
							className="timeline-item"
							style={{ left: offset, width, backgroundColor: item.color }}
							title={`${item.name} (${item.start} - ${item.end})`}
							onMouseDown={(e) => handleMouseDown(e, item, "move", i)}
						>
							<div
								className="resize-handle left"
								onMouseDown={(e) => {
									e.stopPropagation();
									handleMouseDown(e, item, "resize-start", i);
								}}
							/>
							{editingItemId === item.id ? (
								<input
									value={editingText}
									onChange={(e) => setEditingText(e.target.value)}
									onBlur={() => {
										setTimelineItems((items) =>
											items.map((i) =>
												i.id === item.id ? { ...i, name: editingText } : i
											)
										);
										setEditingItemId(null);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") e.target.blur();
									}}
									autoFocus
								/>
							) : (
								<span
									onDoubleClick={() => {
										setEditingItemId(item.id);
										setEditingText(item.name);
									}}
								>
									{item.name}
								</span>
							)}
							{width > 50 && (
								<button
									className="delete-item-button"
									style={{
										position: "absolute",
										top: 2,
										right: 4,
										fontSize: 10,
									}}
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteItem(item.id);
									}}
									title="Delete"
								>
									❌
								</button>
							)}
							<div
								className="resize-handle right"
								onMouseDown={(e) => {
									e.stopPropagation();
									handleMouseDown(e, item, "resize-end", i);
								}}
							/>
						</div>
					);
				})}
			</div>
		));
	};

	return (
		<div className="timeline-container">
			<div className="view-toggle">
				<button onClick={() => setView("day")}>Day</button>
				<button onClick={() => setView("week")}>Week</button>
				<button onClick={() => setView("month")}>Month</button>
			</div>
			{renderHeader()}
			{renderLanes()}
		</div>
	);
};

export default Timeline;
