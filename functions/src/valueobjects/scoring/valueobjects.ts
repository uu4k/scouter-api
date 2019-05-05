// TODO front側で再利用できるようにする
export class Condition {
  constructor(readonly operator: Operator, readonly operand: Operand) {}
}

export type Target = {
  readonly value: string

  enableCondition(condition: Condition): boolean
}

export class Tweet implements Target {
  public readonly value: string = 'tweet'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export class Reply implements Target {
  public readonly value: string = 'reply'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export class Follow implements Target {
  public readonly value: string = 'follow'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export class Follower implements Target {
  public readonly value: string = 'follower'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export class Name implements Target {
  public readonly value: string = 'name'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export class Profile implements Target {
  public readonly value: string = 'profile'
  public enableCondition(condition: Condition): boolean {
    return [EqualTo, Contain].some(enableOperator => {
      return condition.operator instanceof enableOperator
    })
  }
}

export const targets = [
  new Tweet(),
  new Reply(),
  new Follow(),
  new Follower(),
  new Name(),
  new Profile()
]

export class TargetFactory {
  public static create(targetValue: string): Target | null {
    for (const t of targets) {
      if (t.value === targetValue) {
        return Object.freeze(t)
      }
    }
    return null
  }
}

export type Operand = string

export type Operator = {
  readonly value: string
}

// export class GreaterThan implements Operator {
//   readonly value: string = 'greater_than'
// }

// export class GreaterThanOrEqualTo implements Operator {
//   readonly value: string = 'greater_than_or_equal_to'
// }

export class EqualTo implements Operator {
  readonly value: string = 'equal_to'
}

// export class LessThan implements Operator {
//   readonly value: string = 'less_than'
// }

// export class LessThanOrEqualTo implements Operator {
//   readonly value: string = 'less_than_or_equal_to'
// }

// export class OtherThan implements Operator {
//   readonly value: string = 'other_than'
// }

export class Contain implements Operator {
  readonly value: string = 'contain'
}

export const operators = [
  // new GreaterThan(),
  // new GreaterThanOrEqualTo(),
  new EqualTo(),
  // new LessThan(),
  // new LessThanOrEqualTo(),
  // new OtherThan(),
  new Contain()
]

export class OperatorFactory {
  public static create(operatorValue: string): Operator | null {
    for (const o of operators) {
      if (o.value === operatorValue) {
        return Object.freeze(o)
      }
    }
    return null
  }
}
