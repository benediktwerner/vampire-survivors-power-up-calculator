## How to add a new game version

1. Open `data.js`
2. Duplicate the latest version and update it with the new values
3. Update `CURRENT_STABLE_VERSION`, `CURRENT_BETA_VERSION`, and `LAST_UPDATE_DATE` variables at the top of the file appropriately.

## How to update icons

1. Copy `items.png` and `items.json` from `<game directory>\resources\app\.webpack\renderer\assets\img` into this directory
2. Run `item-img-extractor.py`
3. Find the correct extracted sprites in the `icons` directory
4. Copy them to the `images` directory and rename them to how the power up is called
