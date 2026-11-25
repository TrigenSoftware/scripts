import extensionsRule from './extensions.js'
import funcStyleRule from './func-style.js'
import importOrderRule from './import-order.js'
import memberOrderingRule from './member-ordering.js'
import namedExportOrderRule from './named-export-order.js'
import namedImportOrderRule from './named-import-order.js'
import namingConventionRule from './naming-convention.js'
import noManualMemoRule from './no-manual-memo.js'
import typeImportStyleRule from './type-import-style.js'

export default {
  meta: {
    name: 'trigen'
  },
  rules: {
    extensions: extensionsRule,
    'func-style': funcStyleRule,
    'import-order': importOrderRule,
    'member-ordering': memberOrderingRule,
    'named-export-order': namedExportOrderRule,
    'named-import-order': namedImportOrderRule,
    'naming-convention': namingConventionRule,
    'no-manual-memo': noManualMemoRule,
    'type-import-style': typeImportStyleRule
  }
}
