import RadioSelect from "src/component/radio/RadioSelect";
import { localInstance } from "src/i18n/locals";
import { ContentTemplateSource } from "src/model/action/CreateFileFormAction";

export default function (props: {
	value: string;
	onChange: (value: ContentTemplateSource) => void;
}) {
	const { value, onChange } = props;
	return (
		<RadioSelect
			value={value}
			onChange={onChange}
			options={textSourceOptions}
		/>
	);
}

const textSourceOptions = [
	{
		id: ContentTemplateSource.TEXT,
		value: ContentTemplateSource.TEXT,
		label: localInstance.source_text,
	},
	{
		id: ContentTemplateSource.FILE,
		value: ContentTemplateSource.FILE,
		label: localInstance.source_file,
	},
];
