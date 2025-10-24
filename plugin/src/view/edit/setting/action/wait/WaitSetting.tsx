import { localInstance } from "src/i18n/locals";
import { IFormAction } from "src/model/action/IFormAction";
import { WaitFormAction, DEFAULT_WAIT_TIME, DEFAULT_WAIT_UNIT } from "src/model/action/WaitFormAction";
import { FormActionType } from "src/model/enums/FormActionType";
import { WaitTimeUnit } from "src/model/enums/WaitTimeUnit";
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

    const handleWaitTimeChange = (waitTime: number) => {
        const newAction: WaitFormAction = {
            ...action,
            waitTime: waitTime,
        };
        props.onChange(newAction);
    };

    const handleUnitChange = (unit: WaitTimeUnit) => {
        const newAction: WaitFormAction = {
            ...action,
            unit: unit,
        };
        props.onChange(newAction);
    };

    const getUnitLabel = (unit: WaitTimeUnit): string => {
        switch (unit) {
            case WaitTimeUnit.MILLISECONDS:
                return localInstance.milliseconds;
            case WaitTimeUnit.SECONDS:
                return localInstance.seconds;
            case WaitTimeUnit.MINUTES:
                return localInstance.minutes;
            default:
                return localInstance.milliseconds;
        }
    };

    return (
        <>
            <CpsFormItem label={localInstance.wait_time}>
                <input
                    type="number"
                    min="0"
                    step={action.unit === WaitTimeUnit.MILLISECONDS ? "100" : "1"}
                    placeholder={DEFAULT_WAIT_TIME.toString()}
                    value={action.waitTime || DEFAULT_WAIT_TIME}
                    onChange={(e) => {
                        const value = parseInt(e.target.value) || DEFAULT_WAIT_TIME;
                        handleWaitTimeChange(value);
                    }}
                />
            </CpsFormItem>
            
            <CpsFormItem label={localInstance.wait_unit}>
                <select
                    value={action.unit || DEFAULT_WAIT_UNIT}
                    onChange={(e) => {
                        const unit = e.target.value as WaitTimeUnit;
                        handleUnitChange(unit);
                    }}
                >
                    <option value={WaitTimeUnit.MILLISECONDS}>
                        {getUnitLabel(WaitTimeUnit.MILLISECONDS)}
                    </option>
                    <option value={WaitTimeUnit.SECONDS}>
                        {getUnitLabel(WaitTimeUnit.SECONDS)}
                    </option>
                    <option value={WaitTimeUnit.MINUTES}>
                        {getUnitLabel(WaitTimeUnit.MINUTES)}
                    </option>
                </select>
            </CpsFormItem>
        </>
    );
}