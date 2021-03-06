ko.bindingHandlers['slot'] = {
  'init': function  (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var bindingValue = valueAccessor();
    var slotName;
    var slotData;
    if (bindingValue === null || typeof bindingValue == 'string') {
      slotName = bindingValue;
    } else if (typeof bindingValue == 'object') {
      slotName = bindingValue['name'];
      slotData = bindingValue['data'];
    }

    var componentTemplateNodes = bindingContext['$componentTemplateNodes'];
    if (!componentTemplateNodes) {
      throw new Error('slot binding cannot be used outside of component template.');
    }

    var slotTemplateElems = ko.utils.arrayFilter(componentTemplateNodes, function (elem) {
      return (elem.nodeType == 1 && elem.getAttribute('slot') || null) === (slotName || null);
    });

    var outerContext = bindingContext;
    while (outerContext['$componentTemplateNodes'] === componentTemplateNodes) {
      outerContext = outerContext['$parentContext'];
    }

    var slotContext = typeof slotData === 'undefined'
            ? outerContext
            : outerContext['createChildContext'](slotData);

    ko.applyBindingsToNode(element, {
      'template': { 'nodes': slotTemplateElems },
    }, slotContext);

    return { 'controlsDescendantBindings': true };
  }
};
