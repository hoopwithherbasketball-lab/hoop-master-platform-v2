const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = {
  webpack: {
    alias: {
      '@hoop-master/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@hoop-master/ui/*': path.resolve(__dirname, '../../packages/ui/src/*'),
      '@hoop-master/types': path.resolve(__dirname, '../../packages/types/src'),
      '@hoop-master/types/*': path.resolve(__dirname, '../../packages/types/src/*'),
      '@hoop-master/features': path.resolve(__dirname, '../../packages/features/dist/features/src'),
      '@hoop-master/features/*': path.resolve(__dirname, '../../packages/features/dist/features/src/*'),
      '@hoop-master/supabase': path.resolve(__dirname, '../../packages/supabase/dist'),
      '@hoop-master/supabase/*': path.resolve(__dirname, '../../packages/supabase/dist/*'),
    },
    configure: (webpackConfig) => {
      if (webpackConfig.resolve && Array.isArray(webpackConfig.resolve.plugins)) {
        webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
          (plugin) => plugin.constructor.name !== ModuleScopePlugin.name
        );
      }
      return webpackConfig;
    },
  },
};