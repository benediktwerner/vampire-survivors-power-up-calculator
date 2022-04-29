## How to Add New Game Version Prices Support

1. Go To `data.js`
2. Duplicate Old Version Data then edit it to suit new game version (`name` property is for option name)
4. Update `latest_data_version` variable (at the top)
5. Update `latest_update_date` variable (at the top)

## How to update icons

1. Copy `items.png` and `items.json` from `<game directory>\resources\app\.webpack\renderer\assets\img` into this directory
2. Run `item-img-extractor.py`
3. Find the correct extracted sprites in the `icons` directory
4. Copy them to the `images` directory and rename them to how the power up is called
