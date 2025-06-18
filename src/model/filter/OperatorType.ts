export enum OperatorType {
    ContainsAny = "contains_any",
    Contains = "contains",
    NotContains = "not_contains",
    Equals = "equals",
    NotEquals = "not_equals",
    HasValue = "has_value",
    NoValue = "no_value",
    GreaterThan = "greater_than",
    GreaterThanOrEqual = "greater_than_or_equal",
    LessThan = "less_than",
    LessThanOrEqual = "less_than_or_equal",
    RegexMatch = "regex_match",
    // Time Operators
    TimeAfter = "time_after",
    TimeAfterOrEqual = "time_after_or_equal",
    TimeBefore = "time_before",
    TimeBeforeOrEqual = "time_before_or_equal",
    // checkbox
    Checked = "checked",
    Unchecked = "unchecked",
    Unselected = "unselected",

    // group
    And = "and",
    Or = "or",
}

export type RelationType = OperatorType.And | OperatorType.Or;