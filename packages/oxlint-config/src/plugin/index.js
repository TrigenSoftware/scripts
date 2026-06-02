import extensionsRule from './extensions.js'
import importOrderRule from './import-order.js'
import memberOrderingRule from './member-ordering.js'
import namedImportOrderRule from './named-import-order.js'
import namingConventionRule from './naming-convention.js'

export default {
  meta: {
    name: 'trigen'
  },
  rules: {
    'extensions': extensionsRule,
    'import-order': importOrderRule,
    'member-ordering': memberOrderingRule,
    'named-import-order': namedImportOrderRule,
    'naming-convention': namingConventionRule
  }
}
