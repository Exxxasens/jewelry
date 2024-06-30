"use client";

import { Material } from "@prisma/client";
import { useEffect } from "react";
import {
	type Control,
	type UseFormResetField,
	useWatch,
} from "react-hook-form";
import { type ProductSchema } from "~/lib/schemas/productSchema";
import ProbeSelect from "./ProbeSelect";

interface MaterialProps {
	control: Control<ProductSchema>;
	resetField: UseFormResetField<ProductSchema>;
}

interface ProbesList {
	[Material.Gold]: string[];
	[Material.Silver]: string[];
	[Material.Platinum]: string[];
}

const probes = {
	[Material.Gold]: ["585", "583", "750"],
	[Material.Silver]: ["925", "875"],
	[Material.Platinum]: ["950", "900"],
} satisfies ProbesList;

function getProbesByMaterial(material: Material) {
	if (material in probes) {
		return probes[material as keyof typeof probes];
	}
	return undefined;
}

const Probe: React.FC<MaterialProps> = ({ control, resetField }) => {
	const material = useWatch<ProductSchema>({
		control,
		name: "material",
	});

	useEffect(() => {
		resetField("probe");
	}, [material, resetField]);

	if (!material) {
		return null;
	}

	const materialProbes = getProbesByMaterial(material as Material);

	if (!materialProbes) {
		return null;
	}

	return (
		<div className="flex flex-col">
			<p className="card-heading">Проба:</p>
			<ProbeSelect probes={materialProbes} control={control} />
		</div>
	);
};

export default Probe;
