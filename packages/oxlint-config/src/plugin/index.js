import englishOnlyCommentsRule from './english-only-comments.js'
import extensionsRule from './extensions.js'
import flatLayersRule from './flat-layers.js'
import funcStyleRule from './func-style.js'
import importOrderRule from './import-order.js'
import memberOrderingRule from './member-ordering.js'
import namedExportOrderRule from './named-export-order.js'
import namedImportOrderRule from './named-import-order.js'
import namingConventionRule from './naming-convention.js'
import noClassnamePropsRule from './no-classname-props.js'
import noEnumRule from './no-enum.js'
import noManualMemoRule from './no-manual-memo.js'
import suspenseFallbackRule from './suspense-fallback.js'
import timeDatetimeRule from './time-datetime.js'
import typeImportStyleRule from './type-import-style.js'

export default {
  meta: {
    name: 'trigen'
  },
  rules: {
    'english-only-comments': englishOnlyCommentsRule,
    extensions: extensionsRule,
    'flat-layers': flatLayersRule,
    'func-style': funcStyleRule,
    'import-order': importOrderRule,
    'member-ordering': memberOrderingRule,
    'named-export-order': namedExportOrderRule,
    'named-import-order': namedImportOrderRule,
    'naming-convention': namingConventionRule,
    'no-classname-props': noClassnamePropsRule,
    'no-enum': noEnumRule,
    'no-manual-memo': noManualMemoRule,
    'suspense-fallback': suspenseFallbackRule,
    'time-datetime': timeDatetimeRule,
    'type-import-style': typeImportStyleRule
  }
}
