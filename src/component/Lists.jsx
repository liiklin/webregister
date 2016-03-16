import React, {
  Component
}
from 'react';
import {
  Form, Table, Button, Popconfirm, message, Input, Row, Col, Modal, InputNumber
}
from 'antd';
import _ from 'underscore';

const createForm = Form.create;
const FormItem = Form.Item;

const columns = [{
  title: '名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'URL地址',
  dataIndex: 'webhook',
  key: 'webhook',
}, {
  title: '更新频率',
  dataIndex: 'freq',
  key: 'freq',
}];

let noop = () => {
  return false;
}

var data = new Array();
for (let i = 0; i < 1000; i++) {
  data.push({
    "id": i + 1,
    "key": i + 1,
    "name": `合同${i + 1}`,
    "webhook": `http://10.132.133.59:1000${i + 1}`,
    "freq": 300
  });
}

let Lists = React.createClass({
  getInitialState() { //初始化
      return {
        freqVlaue: 300,
        data: data,
        addLoading: false,
        visible: false,
        selectedRowKeys: [], // 这里配置默认勾选列
        delLoading: false,
      };
    },
    add() { //点击添加
      this.setState({
        visible: true
      });
    },
    delete() {
      this.setState({
        delLoading: true
      });
      // 模拟 ajax 请求，完成后清空
      setTimeout(() => {
        let len = this.state.selectedRowKeys.length;
        data = _.filter(data, (val) => { //删除data
          // console.log(this.state.selectedRowKeys.indexOf(val.key) > -1);
          return this.state.selectedRowKeys.indexOf(val.key) == -1;
        });
        this.setState({
          selectedRowKeys: [],
          delLoading: false,
          data: data,
        });
        message.success("成功删除" + len + "条记录。");
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({
        selectedRowKeys
      });
    },
    confirm() { //删除确认
      this.delete();
    },
    handleOk() { //确认添加
      this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          return;
        }
        this.setState({
          addLoading: true,
        });
        setTimeout(() => {
          let ret = [{
            "id": this.state.data.length + 1,
            "key": this.state.data.length + 1,
            "name": values.name,
            "webhook": values.webhook,
            "freq": values.freq
          }];
          data = ret.concat(data);
          this.setState({
            addLoading: false,
            visible: false,
            data: data
          });
          message.success("添加成功");
        }, 1500);
      });
    },
    handleCancel() { //确认取消
      this.setState({
        visible: false
      });
    },
    checkWebhook(rule, value, callback) {
      console.log("checkFreq" + value)
      // let reg = /^(https|http|ftp|rtsp|mms):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/; //url正则
      let reg = /[a-zA-z]+:\/\/[^\s]*/; //url正则
      if (!value) {
        callback();
      } else {
        if (!reg.test(value)) {
          callback([new Error('请输入正确URL地址,格式如http://10.132.133.59:10000')]);
        } else {
          callback();
        }
      }
    },
    render() {
      const {
        delLoading, selectedRowKeys
      } = this.state;

      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
      const hasSelected = selectedRowKeys.length > 0;

      const {
        getFieldProps
      } = this.props.form;

      const nameProps = getFieldProps('name', {
        validate: [{
          rules: [{
            required: true,
            whitespace: false,
            message: '请输入名称'
          }, ],
          trigger: ['onBlur', 'onChange'],
        }, ]
      });
      const webhookProps = getFieldProps('webhook', {
        rules: [{
          required: true,
          message: '请输入URL地址'
        }, {
          validator: this.checkWebhook
        }, ],
      });

      const formItemLayout = {
        labelCol: {
          span: 8
        },
        wrapperCol: {
          span: 16
        },
      };
      return (
        <div>
        <div style={{ marginBottom: 16 ,marginTop:16}}>
          <Button type="" onClick={this.add}>添加</Button>
          <Popconfirm title="确定要删除这个任务吗？" onConfirm={this.confirm} onCancel={this.cancel}>
            <Button type="primary" style={{marginLeft:10}}
                    disabled={!hasSelected} loading={this.state.delLoading}>删除</Button>
          </Popconfirm>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}</span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
        <Modal ref="modal"
               visible={this.state.visible}
               title="添加" onOk={this.handleOk} onCancel={this.handleCancel}
               footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.addLoading} onClick={this.handleOk}>
              提 交
            </Button>
          ]}>
          <Form horizontal form={this.props.form}>
            <Row>
              <Col span="20">
                <FormItem
                  {...formItemLayout}
                   hasFeedback
                  label="名称：">
                  <Input {...nameProps} type="text" placeholder="请输入名称"
                         onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                         autoComplete="off" id="name" name="name" />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="20">
                <FormItem
                  {...formItemLayout}
                   hasFeedback
                  label="URL地址：">
                  <Input {...webhookProps} type="text" placeholder="请输入URL地址"
                         onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                         autoComplete="off" id="webhook" name="webhook"/>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="20">
                 <FormItem
                  label="请输入更新频率(秒)："
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}>
                  <InputNumber min={1} step={1} {...getFieldProps('freq', { initialValue: 300 })} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
      );
    }
});

Lists = Form.create()(Lists);

export default Lists;