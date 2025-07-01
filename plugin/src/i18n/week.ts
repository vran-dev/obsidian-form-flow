import { isZh } from "./locals"

export const ZH_FULL_WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
export const ZH_MEDIUM_WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export const ZH_SHORT_WEEK = ['日', '一', '二', '三', '四', '五', '六']

export const EN_FULL_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const EN_MEDIUM_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const EN_SHORT_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const ZH_FULL_MONTH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
export const ZH_SHORT_MONTH = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']

export const EN_FULL_MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const EN_SHORT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function weeks() {
    return isZh() ? ZH_FULL_WEEK : EN_FULL_WEEK
}

export function week(weekday: number, type: 'short' | 'medium' | 'full' = "full"): string {
    switch (type) {
        case 'short':
            return isZh() ? ZH_SHORT_WEEK[weekday] : EN_SHORT_WEEK[weekday]
        case 'medium':
            return isZh() ? ZH_MEDIUM_WEEK[weekday] : EN_MEDIUM_WEEK[weekday]
        default:
            return isZh() ? ZH_FULL_WEEK[weekday] : EN_FULL_WEEK[weekday]
    }
}

export function month(month: number, type: 'short' | 'full' = "full"): string {
    switch (type) {
        case 'short':
            return isZh() ? ZH_SHORT_MONTH[month] : EN_SHORT_MONTH[month]
        default:
            return isZh() ? ZH_FULL_MONTH[month] : EN_FULL_MONTH[month]
    }
}