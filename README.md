## Upgrades against original

- Automatic calculation after page refresh

- Next Lvl Cost - How much will you need to spend to get next level at lowest price

- Powerup prices are rounded (Game does this also)

- Potential Optimalization When Computing Prices (?) (More Optimalizations can be done btw)

- Comments and index.html split, added for readability

- (TODO) Move Data To New file, and make it easy to add new version

## Add New Game Version Support

(TODO)

## How to update icons

1. Copy `items.png` and `items.json` from `<game directory>\resources\app\.webpack\renderer\assets\img` into this directory
2. Run `item-img-extractor.py`
3. Find the correct extracted sprites in the `icons` directory
4. Copy them to the `images` directory and rename them to how the power up is called
