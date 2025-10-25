import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { WaitFormAction, DEFAULT_WAIT_TIME } from "src/model/action/WaitFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import CpsFormItem from "src/view/shared/CpsFormItem";

export function WaitSetting(props: {
    value: IFormAction;
    onChange: (value: IFormAction) => void;
}) {
    const { value } = props;

    if (value.type !== FormActionType.WAIT) {
        return null;
    }

    const action = value as WaitFormAction;

    return (
        <>
            <CpsFormItem label={`${localInstance.wait_time} (${localInstance.milliseconds})`}>
                <input
                    type="number"
                    placeholder={DEFAULT_WAIT_TIME.toString()}
                    value={action.waitTime ?? ""}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        let waitTime: number | undefined;
                        
                        if (inputValue === "") {
                            // 允许空值，执行时会使用默认值
                            waitTime = undefined;
                        } else {
                            const parsedValue = parseInt(inputValue);
                            waitTime = isNaN(parsedValue) ? undefined : parsedValue;
                        }
                        
                        const newAction: WaitFormAction = {
                            ...action,
                            waitTime: waitTime,
                        };
                        props.onChange(newAction);
                    }}
                />
            </CpsFormItem>
        </>
    );
}