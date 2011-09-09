class AddUserIdToCamera < ActiveRecord::Migration
  def change
    add_column :cameras, :user_id, :integer
  end
end
