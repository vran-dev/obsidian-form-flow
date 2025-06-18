import { FormService, FormSubmitOptions } from "src/service/FormService";
import { FormConfig } from "../../model/FormConfig";
import "./CpsFormActionView.css";
import { CpsFormRenderView } from "./CpsFormRenderView";
import { FormIdValues } from "src/service/FormValues";
import { useObsidianApp } from "src/context/obsidianAppContext";

type Props = {
	formConfig: FormConfig;
	options?: {
		afterSubmit?: (state: Record<string, any>) => void;
	};
} & React.HTMLAttributes<HTMLDivElement>;

export default function (props: Props) {
	const viewOptions = props.options || {};
	const app = useObsidianApp();
	const { formConfig } = props;
	const onSubmit = async (values: FormIdValues) => {
		const context: FormSubmitOptions = {
			app: app,
		};
		const formService = new FormService();
		await formService.submit(values, formConfig, context);
	};

	return (
		<CpsFormRenderView
			fields={formConfig.fields}
			onSubmit={onSubmit}
			afterSubmit={(state) => {
				viewOptions.afterSubmit?.(state);
			}}
		/>
	);
}
