import { moment } from "obsidian";
import { Objects } from "./Objects";

export function processObTemplate(templateContent: any) {
    return processObTemplateInContext(templateContent, { moment: moment() });
}

type Context = {
    moment: moment.Moment;
    title?: string;
}

export function processObTemplateInContext(templateContent: any, context: Context) {
    if (!Objects.exists(templateContent)) {
        return templateContent;
    }
    if (typeof templateContent !== 'string') {
        return templateContent;
    }

    // match {{date:format}}, {{time:format}} 
    const dateFormatRegex = /{{date:(.*?)}}/g;
    const timeFormatRegex = /{{time:(.*?)}}/g;
    const dateRegex = /{{date}}/g;
    const timeRegex = /{{time}}/g;
    const momentTime = context.moment;

    let res = templateContent.replace(dateFormatRegex, (match, format) => {
        return momentTime.format(format?.trim() || "YYYY-MM-DD");
    });

    res = res.replace(timeFormatRegex, (match, format) => {
        return momentTime.format(format?.trim() || "HH:mm");
    });

    res = res.replace(dateRegex, () => {
        return momentTime.format("YYYY-MM-DD");
    });

    res = res.replace(timeRegex, () => {
        return momentTime.format("HH:mm");
    });

    // match {{title}}
    if (context.title) {
        const titleRegex = /{{title}}/g;
        res = res.replace(titleRegex, () => {
            if (context.title) {
                return context.title;
            }
            // return original 
            return "{{title}}";
        });
    }
    return res;
}