/*
Config for draft-js: eslintrc.js
*/

module.exports = {
  extends: [
    'fbjs',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],
  rules: {
    'prettier/prettier': ['error', 'fb'],
  },
  plugins: ['prettier'],
  overrides: [
    {
      files: ['examples/draft-0-10-0/**', 'examples/draft-0-9-1/**'],
      rules: {
        'prettier/prettier': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'no-console': 0,
      },
    },
  ],
};


/*
From boilermaker: .eslintrc.json
*/
// {
//   "root": true,
//   "extends": ["fullstack", "prettier", "prettier/react"],
//   "rules": {
//     "semi": 0
//   }
// }
