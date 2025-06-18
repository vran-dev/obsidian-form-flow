import { formIntegrationService } from "src/service/command/FormIntegrationService";
import ToggleControl from "src/view/shared/control/ToggleControl";

export function AsCommandToggle(props: { filePath: string }) {
	const { filePath } = props;

	const value = formIntegrationService.isEnable(filePath);
	const onChange = (value: boolean) => {
		if (!value) {
			formIntegrationService.unregister(filePath);
		} else {
			formIntegrationService.register(filePath);
		}
	};
	return <ToggleControl value={value} onValueChange={onChange} />;
}
