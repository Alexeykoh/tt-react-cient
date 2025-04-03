interface Props {
  name: string;
  contact_info: string;
}

export default function ClientItem({ name, contact_info }: Props) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-light opacity-75">{"Клинет:"}</p>
      <h6 className="text-md font-semibold">{name}</h6>
      <p className="text-sm ">{contact_info}</p>
    </div>
  );
}
