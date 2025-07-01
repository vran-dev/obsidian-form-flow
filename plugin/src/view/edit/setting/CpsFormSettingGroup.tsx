import "./CpsFormSetting.css";

export function CpsFormSettingGroup(props: {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="form--CpsFormSettingGroup">
			<div className="form--SettingGroupHeader">
				{props.icon}
				{props.title}
			</div>
			<div className="form--SettingGroupContent">
				{props.children}
			</div>
		</div>
	);
}
