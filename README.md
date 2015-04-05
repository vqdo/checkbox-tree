# Checkbox Tree

Custom checkbox tree JQuery plugin

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/vqdo/checkbox-tree/master/dist/jquery.checkboxtree.min.js
[max]: https://raw.githubusercontent.com/vqdo/checkbox-tree/master/dist/jquery.checkboxtree.js

In your web page:

```html
<script src="dist/jquery.checkboxtree.js"></script>
<script src="dist/jquery.checkboxtree.min.js"></script>
```

## Quick Start
```
$('#tree-container').checkboxtree({
    data: [
        {
            name: "A checkbox",
            children: [
                {
                    name: "A sub-checkbox",
                    children: [],
                    selected: true
                }
            ]
        }
    ]
});
```

## View Demo

View the [demo](http://vqdo.github.io/checkbox-tree) now.