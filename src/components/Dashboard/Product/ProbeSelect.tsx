import { Controller, type Control } from "react-hook-form";
import { type ProductSchema } from "~/lib/schemas/productSchema";

interface ProbeSelectProps {
	control: Control<ProductSchema>;
	probes: string[];
}

const ProbeSelect: React.FC<ProbeSelectProps> = ({ control, probes }) => {
	return (
		<Controller
			name="probe"
			control={control}
			render={({ field: { value, onBlur, onChange } }) => (
				<div className="flex flex-row gap-2">
					{probes.map((materialProbe) => {
						const isSelected = value === materialProbe;
						return (
							<button
								key={materialProbe}
								type="button"
								className={`button-sm border-none ${isSelected ? "bg-dark text-white" : "bg-[#F2F1F0]"}`}
								onBlur={onBlur}
								onClick={() => onChange(materialProbe)}
							>
								{materialProbe}
							</button>
						);
					})}
				</div>
			)}
		/>
	);
};

export default ProbeSelect;
