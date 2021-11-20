import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import mockApi from "../../api/mock";
import "./index.scss";

const CardHeader = styled.div`
  font-weight: 500;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;
const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default class List extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     loading:false,
    //     lists: {}
    // };
  }

  // componentDidMount() {
  //     mockApi.getDragData().then(res => {
  //         this.setState({ lists: res })
  //     })
  // }

  dragStart(e) {
    this.dragged = e.currentTarget;
    this.toStatus = ''
  }
  dragEnd(e) {
    console.log(e.target);
    this.dragged.style.display = "block";
    if (!e.target.classList) {
      return;
    }

    if (!e.target.classList.contains("item")) {
      return;
    }

    e.target.classList.remove("drag-up");
    e.target.classList.remove("drag-down");
    let to = 0;
    // let toStatus = "";
    if (this.over) {
      this.over.classList.remove("drag-down");
      this.over.classList.remove("drag-up");
      to = Number(this.over.dataset.index);
    //   toStatus = this.over.dataset.status;
    }

    const data = this.props.lists;
    const from = Number(this.dragged.dataset.index);
    const fromId = this.dragged.dataset.id;
    const fromDataType = this.dragged.dataset.type;
    const fromStatus = this.dragged.dataset.status;
    const toDataType = this.dataType;
    if (!fromDataType) alert("not data type");
    console.log(from, "from");
    console.log(to, "to");
    this.setState({ loading: true });
    const addData = data[fromDataType].lists?.splice(from, 1);
    data[this.dataType].lists?.splice(to + 1, 0, addData[0]);
    console.log(data);
    setTimeout(() => {
      // this.setState({ lists: data, loading: false });
      this.props.onChange &&
        this.props.onChange(fromId, fromStatus, this.toStatus, to);
    }, 100);
  }

  dragOver(e) {
      if (e.target.classList.contains('colunm')) {
        this.toStatus = e.target.dataset.status
        this.dataType = e.target.dataset.type
      }
    e.preventDefault();

    this.dragged.style.display = "none";
    if (!e.target.classList.contains("item")) {
      return;
    }

    //判断当前拖拽target 和 经过的target 的 newIndex

    const dgIndex = this.dragged.dataset.index;
    const taIndex = e.target.dataset.index;
    const animateName = dgIndex > taIndex ? "drag-up" : "drag-down";

    if (
      this.over &&
      e.currentTarget.dataset.index !== this.over.dataset.index
    ) {
      this.over.classList.remove("drag-up", "drag-down");
    }
    // console.log(e.currentTarget.classList, 'e.currentTarget.classList');

    if (!e.currentTarget.classList.contains(animateName)) {
      e.target.classList.add(animateName);
      // console.log(e.target, 'e.target');
      this.over = e.target;
      const dataType = e.target.dataset.type;
      this.dataType = dataType;
    }
  }
  render() {
    console.log(this.props.lists);
    const listsElement = Object.keys(this.props.lists || {}).map(
      (listKey, index) => {
        const { status } = this.props.lists[listKey];
        return (
          <div
            className="colunm"
            data-status={status}
            data-type={listKey}
            key={index}
            style={{ minHeight: 100 }}
          >
            <h3 className="title" style={{ marginBottom: "16px" }}>
              {listKey}
            </h3>
            {this.props.lists[listKey].lists?.map((item, i) => (
              <div
                className="item"
                key={`${i}-${index}`}
                draggable="true"
                data-index={i}
                data-type={listKey}
                data-status={status}
                data-id={item.id || item._id}
                onDragEnd={this.dragEnd.bind(this)}
                onDragStart={this.dragStart.bind(this)}
                data-item={JSON.stringify(item)}
              >
                {/* <CardHeader>{listKey}</CardHeader>
                            <CardFooter>
                                 <span className="btn-report">Gareth</span>
                                <Author>
                                    {item.id}
                                </Author>
                            </CardFooter> */}
                {this.props.renderItem && this.props.renderItem(item)}
              </div>
            ))}
          </div>
        );
      }
    );

    return (
      <div onDragOver={this.dragOver.bind(this)} className="contain">
        {listsElement}
      </div>
    );
  }
}
