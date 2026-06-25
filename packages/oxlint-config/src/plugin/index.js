import extensionsRule from './extensions.js'
import importOrderRule from './import-order.js'
import memberOrderingRule from './member-ordering.js'
import namedExportOrderRule from './named-export-order.js'
import namedImportOrderRule from './named-import-order.js'
import namingConventionRule from './naming-convention.js'
import typeImportStyleRule from './type-import-style.js'

export default {
  meta: {
    name: 'trigen'
  },
  rules: {
    'extensions': extensionsRule,
    'import-order': importOrderRule,
    'member-ordering': memberOrderingRule,
    'named-export-order': namedExportOrderRule,
    'named-import-order': namedImportOrderRule,
    'naming-convention': namingConventionRule,
    'type-import-style': typeImportStyleRule
  }
}
