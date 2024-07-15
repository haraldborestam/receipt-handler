type Props = {
  heading: string;
};

function Menu(props: Props) {
  return (
    <>
      <header>
        <h1>{props.heading}</h1>
      </header>
      <hr></hr>
    </>
  );
}

export default Menu;
