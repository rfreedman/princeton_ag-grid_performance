##Ag-Grid Performance Test

### Background

Princeton University is developing a project which requires adherence to Accessability standards.

Because of this requirement, we must disable all of AgGrid's virtualization features,
including animation, deltaRowDataMode, column virtualization, and row virtualization.

Additionally, we ensure that the order of the rows and columns in the DOM match their order in the grid.

These settings are set with:

<pre>
      [animateRows]="false"
      [deltaRowDataMode]="false"
      [ensureDomOrder]="true"
      [suppressColumnVirtualisation]="true"
      [rowBuffer]="99999"
</pre>

We fully understand why disabling these features causes a loss in performance,
and for most of our usage of AgGrid, we have fewer than 100 rows, and performance is acceptable.

For a few uses, however, we something on the order of 700 to 1000 rows, and, not surprisingly, 
with the virtualization disabled, we see noticibly poor performance when re-populating the grid.

We are using state management via Redux, and were simply binding the row data via an angular binding.

We refactored the interaction with AgGrid, removed the binding, stopped using deltaRowDataMode,
and started updating rowNodes directly when individual rows were changed via editing.
We also started using RowNodeTransactions to do bulk row updates. This restored good performance for those operations.

For completely replacing the data, our only apparent option is to use the gridApi ```setRowData()``` function.
This is currently a performance issue for us. 

We found that:
  - initially populating the grid with 700 rows takes about 1.5 seconds
  - populating the grid with 700 rows when it already contains 700 rows takes about 4 seconds
  - populating the grid with an empty array, immediately followed by 700 rows (when the grid already contains 700 rows) takes about 2 seconds (200-300 msec. 
  to clear the grid, about 1.7 - 1.8 seconds to populate it).

So,
 - While we can live with needing to always set 0 rows to clear the grid first before populating it again, this seems like it should not be necessary, and 
 that invoking  ```setRowData()``` when the grid has rows should be as fast as invoking it with zero first, and then invoking it again with data.
 
 - We would like to know if there is anything else that we can do improve the performance of populating the grid, 
 without turning any of the virtualization features back on.

