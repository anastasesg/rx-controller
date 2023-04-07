import {useContext} from "react";
import {Context} from "../provider";
import {Provider} from "../types/provider.type";

export function useProvider(): Provider {
	const provider = useContext(Context);

	if (!provider)
		throw new Error(`Could not resolve provider. Are you trying to resolve it outside of the providers scope?`);

	return provider;
}
