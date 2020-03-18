<template>
    <view class="collection">
        <borrow-list></borrow-list>
    </view>
</template>
<script>
import BorrowList from '../../components/BorrowList';
export default {
    name: 'users-collection',
    components: {
        BorrowList
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.collection {
    @include flex;
    width: 100%;
    min-height: auto;
    justify-content: flex-start;
    padding-left: 30upx;
    background-color: #ffffff;
}
</style>

