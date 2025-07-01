import { localInstance } from "src/i18n/locals";
import "./CpsFormSubmittingAnimation.css";

export default function CpsFormSubmittingAnimation() {
	return (
		<div className="form--CpsFormSubmittingAnimation">
			<div className="form--CpsFormSubmittingAnimationContainer">
				<div className="form--CpsFormSubmittingAnimationIndeterminate"></div>
			</div>
			<div className="form--CpsFormSubmittingAnimationText">
				{localInstance.handling}
			</div>
		</div>
	);
}
