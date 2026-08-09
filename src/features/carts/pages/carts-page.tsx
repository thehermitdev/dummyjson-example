import type { CartsListResponse } from "../api/contracts";
import type { CartsListInput } from "../api/queries";
import { FetchingSkeletonBar } from "#/shared/components/api-skeletons";
import { DataPagination } from "#/shared/components/data-pagination";
import { AppLink } from "#/shared/components/navigation/app-link";

interface UserOption {
  id: number;
  firstName: string;
  lastName: string;
}

export function CartsPage({
  data,
  input,
  users,
  isFetching = false,
  onInputChange,
}: {
  data: CartsListResponse;
  input: CartsListInput;
  users: Array<UserOption>;
  isFetching?: boolean;
  onInputChange: (next: Partial<CartsListInput>) => void;
}) {
  const userMap = new Map(users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Commerce</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Carts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inspect shopping carts and ownership relationships from DummyJSON.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={input.userId ?? ""}
            onChange={(event) =>
              onInputChange({
                userId: event.target.value ? Number(event.target.value) : undefined,
                page: 1,
              })
            }
            className="h-9 min-w-64 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">{data.total} carts</p>
        </div>

        <FetchingSkeletonBar show={isFetching} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Cart</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 text-right font-medium">Discounted total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.carts.map((cart) => (
                <tr key={cart.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <AppLink
                      to="/carts/$cartId"
                      params={{ cartId: String(cart.id) }}
                      className="font-medium hover:underline"
                    >
                      Cart #{cart.id}
                    </AppLink>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {userMap.get(cart.userId) ?? `User #${cart.userId}`}
                  </td>
                  <td className="px-4 py-3">{cart.totalProducts}</td>
                  <td className="px-4 py-3">{cart.totalQuantity}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${cart.discountedTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataPagination
          page={input.page}
          pageSize={input.pageSize}
          total={data.total}
          onPageChange={(page) => onInputChange({ page })}
          onPageSizeChange={(pageSize) => onInputChange({ pageSize, page: 1 })}
        />
      </div>
    </div>
  );
}
