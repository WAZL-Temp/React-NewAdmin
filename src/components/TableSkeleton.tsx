import { Column, DataTable, Skeleton } from "../sharedBase/globalImports";


interface ColumnProps {
    header: string;
}

const TableSkeleton = ({ cols }: { cols: ColumnProps[] }) => {
    return (
        <div className='pb-20'>
            <DataTable
                className="p-datatable-gridlines bg-[var(--color-white)]"
                value={Array(10).fill({})}
                scrollable
                showGridlines
                scrollHeight="400px"
                removableSort
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                resizableColumns
            >
                {cols.map((col, index) => (
                    <Column
                        key={index}
                        header={col.header}
                        style={{ width: "200px" }}
                        headerStyle={{
                            backgroundColor: "#18181a",
                            color: "#fff",
                            textAlign: "center",
                        }}
                        body={() => <Skeleton width="100%" />}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default TableSkeleton;
