/**
 * Flat Layers Design config
 */

export default {
  jsPlugins: ['@trigen/oxlint-config/plugin'],
  rules: {
    // The layers under `app/`, each import resolved as the project's tsconfig resolves it, and
    // the files where hooks live
    'trigen/flat-layers': 'error'
  }
}
