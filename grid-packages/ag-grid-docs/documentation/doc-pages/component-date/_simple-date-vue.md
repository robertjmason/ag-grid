<framework-specific-section frameworks="vue">
|Below is a simple example of filter component:
</framework-specific-section>

<framework-specific-section frameworks="vue">
<snippet transform={false}>
|const CustomDateComponent = {
|    template: `
|      &lt;div class="ag-input-wrapper custom-date-filter" role="presentation" ref="flatpickr">
|          &lt;input type="text" ref="eInput" data-input style="width: 100%;"/>
|          &lt;a class="input-button" title="clear" data-clear>
|              &lt;i class="fa fa-times">&lt;/i>
|          &lt;/a>
|      &lt;/div>
|    `,
|    data: function () {
|        return {
|            date: null
|        };
|    },
|    beforeMount() {
|    },
|    mounted() {
|        this.picker = flatpickr(this.$refs['flatpickr'], {
|            onChange: this.onDateChanged.bind(this),
|            dateFormat: 'd/m/Y',
|            wrap: true
|        });
|
|        this.eInput = this.$refs['eInput'];
|
|        this.picker.calendarContainer.classList.add('ag-custom-component-popup');
|    },
|    methods: {
|        onDateChanged(selectedDates) {
|            this.date = selectedDates[0] || null;
|            this.params.onDateChanged();
|        },
|
|        getDate() {
|            return this.date;
|        },
|
|        setDate(date) {
|            this.picker.setDate(date);
|            this.date = date || null;
|        },
|
|        setInputPlaceholder(placeholder) {
|            this.eInput.setAttribute('placeholder', placeholder);
|        },
|
|        setInputAriaLabel(label) {
|            this.eInput.setAttribute('aria-label', label);
|        }
|    }
|}
</snippet>
</framework-specific-section>