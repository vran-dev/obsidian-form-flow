import { SquareArrowOutUpRight } from "lucide-react";
import "./ExtraInfoCard.css";

export function ExtraInfoCard(props: {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<div
			className="form--ExtraSettingInfoCard"
			onClick={props.onClick}
		>
			<div className="form--ExtraSettingInfoCardAction">
				<SquareArrowOutUpRight size={16} />
			</div>
			<div className="form--ExtraSettingInfoCardTitle">
				{props.icon}
				{props.title}
			</div>
			<div className="form--ExtraSettingInfoCardContent">
				{props.children}
			</div>
		</div>
	);
}
