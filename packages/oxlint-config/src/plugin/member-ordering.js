const defaultOrder = [
  'public-static-method',
  'protected-static-method',
  'private-static-method',
  'public-static-field',
  'protected-static-field',
  'private-static-field',
  'public-decorated-field',
  'protected-decorated-field',
  'private-decorated-field',
  'public-instance-field',
  'protected-instance-field',
  'private-instance-field',
  'public-abstract-field',
  'protected-abstract-field',
  'signature',
  'public-constructor',
  'protected-constructor',
  'private-constructor',
  'instance-method'
]

function getDefaultOptions(context) {
  return context.options[0]?.default ?? {}
}

function getMemberTypes(context) {
  return getDefaultOptions(context).memberTypes ?? defaultOrder
}

function getAccessibility(member) {
  return member.accessibility ?? 'public'
}

function hasDecorators(member) {
  return (member.decorators?.length ?? 0) > 0
}

function isAbstract(member) {
  return member.abstract === true
}

function isSignature(member) {
  return member.type.includes('Signature')
}

function isMethod(member) {
  return member.type === 'MethodDefinition'
    || member.type === 'TSAbstractMethodDefinition'
}

function isField(member) {
  return member.type === 'PropertyDefinition'
    || member.type === 'AccessorProperty'
    || member.type === 'TSAbstractPropertyDefinition'
}

function getMemberType(member) {
  const accessibility = getAccessibility(member)

  if (isSignature(member)) {
    return 'signature'
  }

  if (member.kind === 'constructor') {
    return `${accessibility}-constructor`
  }

  if (isMethod(member)) {
    if (member.static) {
      return `${accessibility}-static-method`
    }

    return 'instance-method'
  }

  if (isField(member)) {
    if (isAbstract(member)) {
      return `${accessibility}-abstract-field`
    }

    if (hasDecorators(member)) {
      return `${accessibility}-decorated-field`
    }

    if (member.static) {
      return `${accessibility}-static-field`
    }

    return `${accessibility}-instance-field`
  }

  return null
}

function getRank(memberType, memberTypes) {
  const rank = memberTypes.indexOf(memberType)

  return rank === -1 ? Number.POSITIVE_INFINITY : rank
}

function getMemberName(member) {
  if (member.kind === 'constructor') {
    return 'constructor'
  }

  const key = member.key

  if (!key) {
    return member.type
  }

  if (key.type === 'Identifier' || key.type === 'PrivateIdentifier') {
    return key.name
  }

  if (
    key.type === 'Literal'
    || key.type === 'StringLiteral'
    || key.type === 'NumericLiteral'
  ) {
    return String(key.value)
  }

  return member.type
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce configured class member ordering.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          default: {
            type: 'object',
            properties: {
              order: {
                enum: ['as-written']
              },
              memberTypes: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            },
            additionalProperties: true
          }
        },
        additionalProperties: true
      }
    ]
  },
  create(context) {
    const memberTypes = getMemberTypes(context)

    return {
      ClassBody(node) {
        let previousMember = null

        for (const member of node.body) {
          const memberType = getMemberType(member)

          if (memberType === null) {
            continue
          }

          const rank = getRank(memberType, memberTypes)

          if (previousMember && previousMember.rank > rank) {
            context.report({
              node: member,
              message: `Member "${getMemberName(member)}" should be declared before "${getMemberName(previousMember.node)}".`
            })

            return
          }

          previousMember = {
            node: member,
            rank
          }
        }
      }
    }
  }
}
